import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

// Utility to format current date as "YYYY-MM"
function getCurrentPayPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}


export const createPayroll = async (employeeId: number) => {
  // 1. Retrieve employee grossPay
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { grossPay: true },
  });

  if (!employee) {
    throw new AppError('Employee not found', 404, 'NOT_FOUND');
  }

  const { grossPay } = employee;
  const payPeriod = getCurrentPayPeriod();

  // 2. Check if payroll already exists for this employee and month
  const existing = await prisma.payroll.findFirst({
    where: { employeeId, payPeriod },
  });

  if (existing) {
    throw new AppError(`Payroll already exists for ${payPeriod}`, 409, 'PAYROLL_EXISTS');
  }

  // 3. Calculate payroll figures
  const taxRate = 10;
  const pensionRate = 5;
  const nhisRate = 2;
  const commissionRate = 2;

  const tax = Number(((taxRate / 100) * grossPay).toFixed(2));
  const pension = Number(((pensionRate / 100) * grossPay).toFixed(2));
  const nhis = Number(((nhisRate / 100) * grossPay).toFixed(2));
  const commission = Number(((commissionRate / 100) * grossPay).toFixed(2));

  const deductions = Number((tax + pension + nhis).toFixed(2));
  const netPay = Number((grossPay - deductions + commission).toFixed(2));

  const payslipData = { grossPay, tax, pension, nhis, commission, netPay };

  // 4. Transaction: Create payroll + update employee status to "ready"
  const [payroll] = await prisma.$transaction([
    prisma.payroll.create({
      data: {
        employeeId,
        grossPay,
        tax,
        pension,
        nhis,
        commission,
        netPay,
        payPeriod,
        payslip: JSON.stringify(payslipData),
      },
    }),
    prisma.employee.update({
      where: { id: employeeId },
      data: { status: 'ready' },
    }),
  ]);

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
  return payrolls.map(payrolls=>({
    ...payrolls,
    status: employee.status,
  }));
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
    payPeriod: payroll.payPeriod,
    status: payroll.employee.status,
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
// export const deletePayroll= async (id: number) => {
//   const payroll = await prisma.payroll.findUnique({ where: { id } });
//   if (!payroll) {
//       throw new AppError('Payroll not found',404,'Not_found');
//     }
//   return await prisma.payroll.delete({
//     where: { id },
//   });
// };


// export const deleteAllPayrolls = async () => {
//   const count = await prisma.payroll.count();
// if (count === 0) {
//   throw new AppError("No payroll records to delete", 404, "NOT_FOUND");
// }
//   try {
//      await prisma.payroll.deleteMany();
//   } catch (error) {
//         throw new AppError('Failed to delete payrolls', 500, 'DELETE_FAILED');
//   }
 
// };
export const deletePayroll = async (id: number) => {
  // 1. Find payroll with employeeId
  const payroll = await prisma.payroll.findUnique({
    where: { id },
    select: { employeeId: true },
  });

  if (!payroll) {
    throw new AppError('Payroll not found', 404, 'NOT_FOUND');
  }
console.log("Deleting payroll for employee ID:", payroll.employeeId);

try {
  await prisma.$transaction([
    prisma.payroll.delete({ where: { id } }),
    prisma.employee.update({
      where: { id: payroll.employeeId },
      data: { status: 'pending' },
    }),
  ]);
} catch (error) {
  console.error("Transaction error:", error);
  throw new AppError('Failed to delete payroll and update status', 500, 'TRANSACTION_FAILED');
}

  return { message: 'Payroll deleted and employee status reset' };
};

export const deleteAllPayrolls = async () => {
  const payrolls = await prisma.payroll.findMany({
    select: { employeeId: true },
  });

  if (payrolls.length === 0) {
    throw new AppError('No payroll records to delete', 404, 'NOT_FOUND');
  }

  const affectedEmployeeIds = [...new Set(payrolls.map(p => p.employeeId))];

  try {
    await prisma.$transaction([
      prisma.payroll.deleteMany(), // Delete all payrolls
      prisma.employee.updateMany({
        where: { id: { in: affectedEmployeeIds } },
        data: { status: 'pending' },
      }),
    ]);
  } catch (error) {
    throw new AppError('Failed to delete payrolls', 500, 'DELETE_FAILED');
  }
};
