import { Request, Response, NextFunction } from 'express';
import {
  createPayroll,
  getPayrollById,
  getPayrollsByEmployee,
  getAllPayrolls,
  getPayrollSummary,
  deletePayroll
} from '../services/payroll.service';

export const addPayroll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.body;
    const payroll = await createPayroll(employeeId);
    res.status(201).json({ success: true, payroll });
  } catch (error: any) {
    next(error);
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
