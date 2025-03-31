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

// export const createEmployeeController = async (
//   req: Request<EmployeeInput[]>,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
// // If the request body is not an array, wrap it in an array
// const employees: EmployeeInput[] = Array.isArray(req.body) ? req.body : [req.body];
//   for (const employee of employees) {
//     const {
//       fullName,
//       email,
//       accountNumber,
//       HireDate,
//       grossPay,
//       department,
//       employmentType,
//       jobTitle,
//       bankName,
//     } = employee;

//     // Basic validation
//     if (
//       !fullName ||
//       !email ||
//       !accountNumber ||
//       !HireDate ||
//       !department ||
//       !grossPay ||
//       !employmentType ||
//       !jobTitle ||
//       !bankName
//     ) {
//       res.status(400).json({ message: "All fields are required" });
//       return;
//     }
//   }

//   try {
//     const newEmployees = await createEmployee(employees);
//     res.status(201).json({
//       message: "Employee created successfully",
//       data: newEmployees,
    
//     });
//     console.log(newEmployees)
//   } catch (error) {
//     next(error);
//   }
// };

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
      res.status(400).json({ message: 'All fields are required' });
      return;
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
      res.status(400).json({ message: 'No file uploaded' });
      return;
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
