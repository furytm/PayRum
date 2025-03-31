import { prisma } from '../prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'csv-parse';


export interface EmployeeInput {
  fullName: string;
  email: string;
  accountNumber: string;
  HireDate: string;
  grossPay: number;
  department: string;
  employmentType: string;
  jobTitle: string;
  bankName: string;
}

interface EmployeesReturn extends EmployeeInput {
  autoId: string;
}
// Overload signatures
export function createEmployee(employeeData: EmployeeInput): Promise<EmployeesReturn[]>;
export function createEmployee(employeeData: EmployeeInput[]): Promise<EmployeesReturn[]>;

// Implementation
export async function createEmployee(
  employeeData: EmployeeInput | EmployeeInput[]
): Promise<EmployeesReturn[]> {
  const employees = Array.isArray(employeeData) ? employeeData : [employeeData];

  if (!employees.length) throw new Error("No employee data provided.");

  const emails = employees.map((employee) => employee.email);

  // Find existing employees by email
  const existingEmployees = await prisma.employee.findMany({
    where: { email: { in: emails } },
    select: { email: true },
  });

  const existingEmailsSet = new Set(existingEmployees.map((e) => e.email));

  // Filter new employees to avoid duplicates
  const newEmployees = employees.filter(
    (employee) => !existingEmailsSet.has(employee.email)
  );

  if (!newEmployees.length) {
    throw new Error("All provided employees already exist in the database.");
  }

  // Insert employees one by one to return their IDs
  const createdEmployees: EmployeesReturn[] = [];
  for (const employee of newEmployees) {
    const newEmployee = await prisma.employee.create({
      data: {
        ...employee,
        // Ensure grossPay is a number (if coming from CSV, it might be a string)
        grossPay: Number(employee.grossPay),
        autoId: uuidv4().slice(0, 8),
      },
    });
    createdEmployees.push(newEmployee);
  }

  return createdEmployees;
}



export const updateEmployee = async (id: number, updateData: Partial<EmployeeInput>) => {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // If email is being updated, ensure uniqueness
    if (updateData.email && updateData.email !== employee.email) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email: updateData.email },
      });
      if (existingEmployee) {
        throw new Error('Employee with this email already exists');
      }
    }
    
    return await prisma.employee.update({
      where: { id },
      data: updateData,
    });
  };
  
  export const getAllEmployees = async () => {
    return await prisma.employee.findMany();
  };
  
  export const getEmployeeById = async (id: number) => {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  };
  
  export const deleteEmployee = async (id: number) => {
    // Check if employee exists before deleting
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new Error('Employee not found');
    }
    return await prisma.employee.delete({
      where: { id },
    });
  };

  export const parseEmployeeCSV = (csvContent: string): Promise<EmployeeInput[]> => {
    return new Promise((resolve, reject) => {
      parse(csvContent, { columns: true, trim: true }, (err, records: EmployeeInput[]) => {
        if (err) return reject(err);
        // Optionally, add additional validation or transformation here.
        resolve(records);
      });
    });
  };