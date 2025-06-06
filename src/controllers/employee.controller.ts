import { Request, Response, NextFunction } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../services/employee.service";
import { parseEmployeeCSV } from '../services/employee.service';
import { EmployeeInput } from "../services/employee.service";
import { AppError } from "../utils/AppError";


// Helper function to validate employee data
const isValidEmployee = (employee: EmployeeInput): boolean => {
  const requiredFields = [
    'fullName',
    'email',
    'accountNumber',
    'HireDate',
    'grossPay',
    'department',
    'employmentType',
    'jobTitle',
    'bankName',
  ];
  return requiredFields.every((field) => (employee as any)[field]);
};

export const createEmployeeController = async (
  req: Request<EmployeeInput | EmployeeInput[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Wrap non-array input into an array for consistent handling
  const employees: EmployeeInput[] = Array.isArray(req.body) ? req.body : [req.body];

  // Validate all employees
  for (const employee of employees) {
    if (!isValidEmployee(employee)) {
      throw new AppError('All fields are required', 400, 'MISSING_FIELDS');
    }
  }

  try {
    const newEmployees = await createEmployee(employees);
    res.status(201).json({ message: `${newEmployees.length} employee(s) created successfully, {newEmployees.length} employee(s) created successfully`, 
      data: newEmployees });
    console.log(newEmployees);


  } catch (error) {
    next(error);
  }
};

export const updateEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const employee = await updateEmployee(Number(id), updateData);
    res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json({
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await getEmployeeById(Number(id));
    res.status(200).json({
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteEmployee(Number(id));
    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};





export const importEmployeesController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400, 'MISSING_FILE');
    }

    const fileBuffer = req.file.buffer;
    const fileContent = fileBuffer.toString('utf-8');

    // Use the CSV parsing service
    const records = await parseEmployeeCSV(fileContent);

    const createdEmployees = await createEmployee(records);
    res.status(201).json({
      message: 'Employees imported successfully',
      data: createdEmployees,
    });
  } catch (error) {
    next(error);
  }
};
