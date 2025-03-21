import { Request, Response, NextFunction } from 'express';
import { generatePayrollsCSV, generatePayrollsPDFBuffer, getPayslip } from '../services/payslip.services';

export const getPayslipController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payrollId } = req.params;
    const payslip = await getPayslip(Number(payrollId));
    res.status(200).json({ success: true, payslip });
  } catch (error) {
    next(error);
  }
};


// CSV Export Controller
export const exportPayrollsCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const csv = await generatePayrollsCSV();
    res.header('Content-Type', 'text/csv');
    res.attachment('payrolls.csv');
    res.send(csv);
  } catch (error: any) {
    next(error);
  }
};

// PDF Export Controller
export const exportPayrollsPDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await generatePayrollsPDFBuffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="payrolls.pdf"');
    res.send(pdfBuffer);
  } catch (error: any) {
    next(error);
  }
};
