import { prisma } from '../prisma/client';

export const createPayroll = async (
  employeeId: number,
  grossPay: number,
  tax: number,
  pension: number,
  nhis: number,
  commission?: number
) => {
  // Ensure the employee exists
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    throw new Error('Employee not found');
  }

  // Calculate net pay: grossPay minus deductions, plus commission if provided
  const deductions = tax + pension + nhis;
  const netPay = grossPay - deductions + (commission || 0);

  // Create payroll entry and store a payslip as a JSON string (for demonstration)
  const payroll = await prisma.payroll.create({
    data: {
      employeeId,
      grossPay,
      tax,
      pension,
      nhis,
      commission,
      netPay,
      payslip: JSON.stringify({ grossPay, tax, pension, nhis, commission, netPay }),
    },
  });

  return payroll;
};

export const getPayrollById = async (id: number) => {
  console.log("getPayrollById called with id:", id);
  const payroll = await prisma.payroll.findUnique({
    where: { id },
    include: { employee: true }, // Optionally include employee details
  });
  if (!payroll) {
    throw new Error('Payroll record not found');
  }
  return payroll;
};

export const getPayrollsByEmployee = async (employeeId: number) => {
  // Ensure the employee exists (optional, based on your business rules)
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    throw new Error('Employee not found');
  }
  
  const payrolls = await prisma.payroll.findMany({
    where: { employeeId },
    orderBy: { createdAt: 'desc' },
  });
  return payrolls;
};

export const getAllPayrolls = async () => {
  const payrolls = await prisma.payroll.findMany({
    include: { employee: true }, // Optionally include employee details
    orderBy: { createdAt: 'desc' },
  });
  return payrolls;
};
type PayrollSummary = {
  totalGross: number;
  totalTax: number;
  totalPension: number;
  totalNhis: number;
  totalCommission: number;
  totalNet: number;
};

export const getPayrollSummary = async (): Promise<PayrollSummary> => {
  const payrolls = await prisma.payroll.findMany();
  
  const summary = payrolls.reduce(
    (acc: PayrollSummary, payroll) => {
      acc.totalGross += payroll.grossPay;
      acc.totalTax += payroll.tax;
      acc.totalPension += payroll.pension;
      acc.totalNhis += payroll.nhis;
      acc.totalCommission += payroll.commission || 0;
      acc.totalNet += payroll.netPay;
      return acc;
    },
    {
      totalGross: 0,
      totalTax: 0,
      totalPension: 0,
      totalNhis: 0,
      totalCommission: 0,
      totalNet: 0,
    } as PayrollSummary
  );
  
  return summary;
};

