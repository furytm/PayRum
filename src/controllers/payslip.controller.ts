import { Request, Response, NextFunction } from 'express';
import { getPayslip } from '../services/payslip.services';

export const getPayslipController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payrollId } = req.params;
    const payslip = await getPayslip(Number(payrollId));
    res.status(200).json({ success: true, payslip });
  } catch (error) {
    next(error);
  }
};