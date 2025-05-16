import { Request, Response, NextFunction } from 'express';
import {
  createPayroll,
  getPayrollById,
  getPayrollsByEmployee,
  getAllPayrolls,
  getPayrollSummary,
  deletePayroll
} from '../services/payroll.service';

import { deleteAllPayrolls } from '../services/payroll.service';
import { AppError } from '../utils/AppError';

export const addPayroll = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      throw new AppError('Employee ID is required', 400, 'MISSING_EMPLOYEE_ID');
    }

    // If you want to support future extensions with commission override, pass it from req.body here
    const payroll = await createPayroll(employeeId);
  res.status(201).json({
      success: true,
      message: 'Payroll created successfully',
      payroll,
    });

  } catch (err: any) {
    if (err.message?.includes('already exists')) {
    res.status(409).json({
        success: false,
        message: err.message,
        code: 'DUPLICATE_PAYROLL',
      });
    }

    next(err); // Let your global error handler catch anything else
  }
};

export const getPayrollRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payroll = await getPayrollById(Number(id));
    res.status(200).json({ success: true, payroll });
  } catch (error: any) {
    next(error);
  }
};

export const getPayrollsForEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const payrolls = await getPayrollsByEmployee(Number(employeeId));
    res.status(200).json({ success: true, payrolls });
  } catch (error: any) {
    next(error);
  }
};

export const getAllPayrollRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payrolls = await getAllPayrolls();
    res.status(200).json({ success: true, payrolls });
  } catch (error: any) {
    next(error);
  }
};
// NEW: Payroll Summary Endpoint
export const getPayrollSummaryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getPayrollSummary();
    res.status(200).json({ success: true, summary });
  } catch (error: any) {
    next(error);
  }
};
export const deletePayrollController= async(req:Request, res: Response, next: NextFunction)=>{
try {
  const {id}= req.params;
  await deletePayroll(Number(id))
  res.status(200).json({
    message: "Payroll Deleted Successfully"
  })
} catch (error) {
  next(error)
}

}


export const deleteAllPayrollsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteAllPayrolls();
    res.status(200).json({
      message: 'All payroll records deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting payrolls:", error);
    next(error);
  }
};

