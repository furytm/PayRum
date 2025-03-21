import { prisma } from '../prisma/client';

export const createPayroll = async (employeeId: number) => {
  // Ensure the employee exists and retrieve grossPay
  const employee = await prisma.employee.findUnique({ 
    where: { id: employeeId }, 
    select: { grossPay: true }  // Fetch only the grossPay field
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  const { grossPay } = employee; // Use the employee's grossPay

  // Define deduction rates (percentages)
  const taxRate = 10; // 10%
  const pensionRate = 5; // 5%
  const nhisRate = 2; // 2%
  const commissionRate = 2; // 2%

  // Calculate deductions
  const tax = (taxRate / 100) * grossPay;
  const pension = (pensionRate / 100) * grossPay;
  const nhis = (nhisRate / 100) * grossPay;
  const commission = (commissionRate / 100) * grossPay;

  const deductions = tax + pension + nhis;
  const netPay = grossPay - deductions + commission;

  // Create payroll entry
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
    
  // Map each payroll record to add a computed "deductions" field
  const payrollsWithDeductions= payrolls.map(payroll=>({
    ...payroll,
    deductions:payroll.tax +payroll.pension+payroll.nhis,
    employeeFullName: payroll.employee.fullName,
  }));
  return payrollsWithDeductions;
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

