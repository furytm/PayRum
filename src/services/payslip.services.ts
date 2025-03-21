import { stringify } from 'querystring';
import { prisma } from '../prisma/client';
import { Parser as Json2csvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
export const getPayslip = async (payrollId: number) => {
  // Fetch payroll details with related employee
  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: { employee: true }, // Include employee details
  });

  if (!payroll) {
    throw new Error('Payroll record not found');
  }

  // Format payslip response
  const payslip = {
    employee: {
    fullName: payroll.employee.fullName,
      jobTitle: payroll.employee.jobTitle,
      department: payroll.employee.department,
      bankName:payroll.employee.bankName,
      accountNumber:payroll.employee.accountNumber
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
    orderBy: { createdAt: 'desc' },
  });
  const fields = ['id', 'employeeId', 'grossPay', 'tax', 'pension', 'nhis', 'commission', 'netPay', 'payslip', 'createdAt'];
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(payrolls);
  return csv;
};

export const generatePayrollsPDFBuffer = async (): Promise<Buffer> => {
  const payrolls = await prisma.payroll.findMany({
    include: { employee: true },
    orderBy: { createdAt: 'desc' },
  });

  const doc = new PDFDocument();
  let buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  // Title
  doc.fontSize(18).text('Payroll Summary', { align: 'center' });
  doc.moveDown();

  // Header row
  doc.fontSize(12).text('ID | EmployeeID | GrossPay | Tax | Pension | NHIS | Commission | NetPay', { underline: true });
  doc.moveDown();

  payrolls.forEach((p: any) => {
    const line = `${p.id} | ${p.employeeId} | ${p.grossPay} | ${p.tax} | ${p.pension} | ${p.nhis} | ${p.commission || 0} | ${p.netPay}`;
    doc.text(line);
  });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);
  });
};

