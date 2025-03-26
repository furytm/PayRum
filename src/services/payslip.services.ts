// import PDFDocument from "pdfkit";
const PDFDocument = require("pdfkit-table");

import { prisma } from "../prisma/client";
import { Parser as Json2csvParser } from "json2csv";
import fs from "fs";
import path from "path";
// import "pdfkit-table";

export const getPayslip = async (payrollId: number) => {
  // Fetch payroll details with related employee
  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: { employee: true }, // Include employee details
  });

  if (!payroll) {
    throw new Error("Payroll record not found");
  }

  // Format payslip response
  const payslip = {
    employee: {
      fullName: payroll.employee.fullName,
      jobTitle: payroll.employee.jobTitle,
      department: payroll.employee.department,
      bankName: payroll.employee.bankName,
      accountNumber: payroll.employee.accountNumber,
    },
    payroll: {
      grossPay: payroll.grossPay,
      deductions: {
        tax: payroll.tax,
        pension: payroll.pension,
        nhis: payroll.nhis,
        commission: payroll.commission || 0,
      },
      netPay: payroll.netPay,
    },
  };

  return payslip;
};

export const generatePayrollsCSV = async (): Promise<string> => {
  const payrolls = await prisma.payroll.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });
  const fields = [
    "emoloyeeId",
    "employeeFullName",
    "grossPay",
    "tax",
    "pension",
    "nhis",
    "commission",
    "netPay",
    "payslip",
    "createdAt",
  ];
  
    const formattedPayrolls = payrolls.map((p) => ({
      employeeID:p.employee?.id?.toString() || "N/A",
      employeeFullName: p.employee?.fullName || "N/A",  // Get full name, or "N/A" if missing
      grossPay: p.grossPay.toFixed(2),
      tax: p.tax.toFixed(2),
      pension: p.pension.toFixed(2),
      nhis: p.nhis.toFixed(2),
      commission: (p.commission || 0).toFixed(2),
      netPay: p.netPay.toFixed(2),
      payslip: p.payslip,
      createdAt: p.createdAt.toISOString(),
    }));
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(formattedPayrolls);
  return csv;
};

export const generatePayrollsPDFBuffer = async (): Promise<Buffer> => {
  const payrolls = await prisma.payroll.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });

  // const doc = new PDFDocument({ size: "A4", margin: 50 });
  const doc = new PDFDocument();

  let buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => { });
  const logoPath = path.join(__dirname, "..", "assets", "paysum.jpg");
  if (!fs.existsSync(logoPath)) {
    throw new Error("Logo file not found");
  }

  doc.image(logoPath, 50, 45, { width: 100, height: 50 });

  doc.fontSize(18).text("PAYSUM", 50, 100, { align: "right" });
  doc
    .fontSize(10)
    .text("GENESYS TECHHUB,ENUGU,NIGERIA", 50, 120, { align: "right" });
  doc.moveDown(2);
  // Title
  doc.fontSize(18).text("Payroll Summary", { align: "center" });
  doc.moveDown();
  const table = {
    headers: [
      "EmployeeID",
      "Name",
      "GrossPay",
      "Tax",
      "Pension",
      "NHIS",
      "Commission",
      "NetPay",
    ], rows: payrolls.map((p: any) => [
      p.employeeId?.toString() || "N/A",
      p.employee?.fullName || "N/A",
      p.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      p.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      p.pension.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      p.nhis.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      (p.commission || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      p.netPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    ]),
  };
  console.log("doc.table exists:", typeof doc.table); // Check if table function exists

  await doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
    prepareRow: () => doc.font("Helvetica").fontSize(10),
    width: 500,
  });


  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);
  });
};
