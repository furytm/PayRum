import { prisma } from '../prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface EmployeeInput {
  fullName: string;
  email: string;
  accountNumber: string;
  HireDate: string;
  department: string;
  employmentType: string;
  jobTitle: string;
  bankName: string;
}

interface EmployeesReturn extends EmployeeInput {
  autoId: string;
}

export const createEmployee = async (employees: EmployeeInput[]) => {
  // Check if an employee with the same email already exists
  for(const employee of employees){
    const email = employee.email
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });
    if (existingEmployee) {
      throw new Error('Employee with this email already exists');
    }
  }
  const newEmployees: EmployeesReturn[] = []

  for(let employee of employees){
    const {
      fullName,
      email,
      accountNumber,
      HireDate ,
      department,
      employmentType,
      jobTitle,
      bankName,
    } = employee
    const autoId = uuidv4().slice(0, 8);
  
    // Create the employee record in the database
    const newEmployee = await prisma.employee.create({
      data: {
        fullName,
        email,
        accountNumber,
        HireDate ,
        department,
        employmentType,
        jobTitle,
        bankName,
        autoId,
      },
    });

    newEmployees.push(newEmployee)
  }
  // Generate an autoId for employee login (using an 8-character substring of a UUID)

  return newEmployees;
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