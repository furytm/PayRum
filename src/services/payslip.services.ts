// import PDFDocument from "pdfkit";
const PDFDocument = require("pdfkit-table");

import { prisma } from "../prisma/client";
import { Parser as Json2csvParser } from "json2csv";
import fs from "fs";
import path from "path";
import { height } from "pdfkit/js/page";
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
      payrollDate: payroll.createdAt,
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


/**
 * Exports an individual employee's payslip as a PDF.
 * Uses the payroll's createdAt date (referred to as payrollDate) to display the month.
 * Formats the payslip details in a two-column table for readability.
 *
 * @param payrollId - The payroll record's ID.
 * @returns A Promise that resolves to a Buffer containing the PDF data.
 */
export const exportPayslipPDF = async (payrollId: number): Promise<Buffer> => {
  const payslip = await getPayslip(payrollId); // Assumes getPayslip returns a structured payslip object

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  let buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Add Business Logo (optional)
  const logoPath = path.join(__dirname, "..", "assets", "paysum.jpg");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 100, height: 50 });
  }

  // Add Letterhead Text
  doc.fontSize(16).text("PaySum Technologies", 150, 50, { align: "right" });
  doc.fontSize(10).text("1234 Main St.\nCity, State ZIP\nCountry", 150, 70, { align: "right" });
  doc.moveDown(2);

  // Document Title (displaying the month from payrollDate)
  const monthName = payslip.payroll.payrollDate.toLocaleString("en-US", { month: "long" });
  doc.fontSize(18).text(`Payslip for ${monthName}`, 80, 180, { align: "center" });
  doc.moveDown(2);

  // Define starting positions for the two-column table
  const leftColumnX = 50;
  const rightColumnX = 200;
  let currentY = doc.y;

  // ---------------------------
  // Employee Details Section
  // ---------------------------
  const employeeDetails = [
    { label: "Employee Name:", value: payslip.employee.fullName },
    { label: "Job Title:", value: payslip.employee.jobTitle },
    { label: "Department:", value: payslip.employee.department },
    { label: "Bank Name:", value: payslip.employee.bankName },
    { label: "Account Number:", value: payslip.employee.accountNumber },
  ];

  doc.fontSize(12).fillColor("black");
  employeeDetails.forEach((detail) => {
    doc.font("Helvetica-Bold").text(detail.label, leftColumnX, currentY);
    doc.font("Helvetica").text(detail.value, rightColumnX, currentY);
    currentY += 20; // Increase y position for the next row
  });

  doc.moveDown(2);
  currentY = doc.y; // Reset currentY for the next section

  // ---------------------------
  // Payroll Details Section
  // ---------------------------
  const payrollDetails = [
    { label: "Gross Pay:", value: payslip.payroll.grossPay.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "Tax:", value: payslip.payroll.deductions.tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "Pension:", value: payslip.payroll.deductions.pension.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "NHIS:", value: payslip.payroll.deductions.nhis.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "Commission:", value: (payslip.payroll.deductions.commission || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "Net Pay:", value: payslip.payroll.netPay.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
  ];

  payrollDetails.forEach((detail) => {
    doc.font("Helvetica-Bold").text(detail.label, leftColumnX, currentY);
    doc.font("Helvetica").text(detail.value, rightColumnX, currentY);
    currentY += 20;
  });

  // Finalize the PDF document
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });
};


export const exportPayslipCSV = async (payrollId: number): Promise<string> => {
  const payslip = await getPayslip(payrollId);

  // Flatten the payslip object into a single-level object
  const flatPayslip = {
    employeeFullName: payslip.employee.fullName,
    jobTitle: payslip.employee.jobTitle,
    department: payslip.employee.department,
    bankName: payslip.employee.bankName,
    accountNumber: payslip.employee.accountNumber,
    grossPay: payslip.payroll.grossPay.toFixed(2),
    tax: payslip.payroll.deductions.tax.toFixed(2),
    pension: payslip.payroll.deductions.pension.toFixed(2),
    nhis: payslip.payroll.deductions.nhis.toFixed(2),
    commission: payslip.payroll.deductions.commission.toFixed(2),
    netPay: payslip.payroll.netPay.toFixed(2),
  };

  const fields = [
    "employeeFullName",
    "jobTitle",
    "department",
    "bankName",
    "accountNumber",
    "grossPay",
    "tax",
    "pension",
    "nhis",
    "commission",
    "netPay",
  ];
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(flatPayslip);

  return csv;
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
  doc.fontSize(18).text("Payroll Summary", 80, 200, { align: "center" });
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
    padding: 8
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
