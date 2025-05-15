import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export const createPayroll = async (employeeId: number) => {
  // Ensure the employee exists and retrieve grossPay
  const employee = await prisma.employee.findUnique({ 
    where: { id: employeeId }, 
    select: { grossPay: true }  // Fetch only the grossPay field
  });

    if (!employee) {
        throw new AppError('Employee not found',404,'Not_found');
      }

  const { grossPay } = employee; // Use the employee's grossPay

  // Define deduction rates (percentages)
  const taxRate = 10; // 10%
  const pensionRate = 5; // 5%
  const nhisRate = 2; // 2%
  const commissionRate = 2; // 2%

  // Calculate deductions
  const tax = Number(((taxRate / 100) * grossPay).toFixed(2));
  const pension = Number(((pensionRate / 100) * grossPay).toFixed(2));
  const nhis = Number(((nhisRate / 100) * grossPay).toFixed(2));
  const commission = Number(((commissionRate / 100) * grossPay).toFixed(2));

  const deductions = Number((tax + pension + nhis).toFixed(2));
  const netPay = Number((grossPay - deductions + commission).toFixed(2));

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
      throw new AppError('Payroll not found',404,'Not_found');
    }
  return payroll;
};

export const getPayrollsByEmployee = async (employeeId: number) => {
  // Ensure the employee exists (optional, based on your business rules)
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
   if (!employee) {
      throw new AppError('Employee not found',404,'Not_found');
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
    grossPay: payroll.grossPay.toFixed(2),
    tax: payroll.tax.toFixed(2),
    pension: payroll.pension.toFixed(2),
    nhis: payroll.nhis.toFixed(2),
    commission: (payroll.commission || 0).toFixed(2),
    netPay: payroll.netPay.toFixed(2),
    deductions:(payroll.tax +payroll.pension+payroll.nhis).toFixed(2),
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
export const deletePayroll= async (id: number) => {
  const payroll = await prisma.payroll.findUnique({ where: { id } });
  if (!payroll) {
      throw new AppError('Payroll not found',404,'Not_found');
    }
  return await prisma.payroll.delete({
    where: { id },
  });
};
