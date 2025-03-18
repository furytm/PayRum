import { Request, Response, NextFunction } from 'express';
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from '../services/employee.service';

export const createEmployeeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName,
      email,
      accountNumber,
      payPeriod,
      department,
      employmentType,
      jobTitle,
      bankName, } = req.body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !accountNumber ||
      !payPeriod ||
      !department ||
      !employmentType ||
      !jobTitle ||
      !bankName) {
      res.status(400).json({ message: 'All are required' });
    }

    const employee = await createEmployee({
      fullName,
      email,
      accountNumber,
      payPeriod,
      department,
      employmentType,
      jobTitle,
      bankName,
    });
    res.status(201).json({
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};


export const updateEmployeeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const employee = await updateEmployee(Number(id), updateData);
    res.status(200).json({
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployeesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json({
      message: 'Employees fetched successfully',
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await getEmployeeById(Number(id));
    res.status(200).json({
      message: 'Employee fetched successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteEmployee(Number(id));
    res.status(200).json({
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};