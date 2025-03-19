import { stringify } from 'querystring';
import { prisma } from '../prisma/client';

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
