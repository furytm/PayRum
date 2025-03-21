import { prisma } from '../prisma/client';
import { v4 as uuidv4 } from 'uuid';

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
export const createEmployee = async (employeeData: EmployeeInput | EmployeeInput[]): Promise<EmployeesReturn[]> => {
  // Ensure employeeData is always an array
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
  const newEmployees = employees.filter(employee => !existingEmailsSet.has(employee.email));

  if (!newEmployees.length) {
    throw new Error("All provided employees already exist in the database.");
  }

  // Insert employees one by one to return their IDs
  const createdEmployees: EmployeesReturn[] = [];
  for (const employee of newEmployees) {
    const newEmployee = await prisma.employee.create({
      data: {
        ...employee,
        autoId: uuidv4().slice(0, 8),
      },
    });
    createdEmployees.push(newEmployee);
  }

  return createdEmployees;
};




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