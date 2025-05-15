import { Request, Response, NextFunction } from 'express';
import { RequestDemoService } from '../services/demoRequest';
import { AppError } from '../utils/AppError';

export const createRequestDemo = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      workEmail,
      companyName,
      phoneNumber,
      companyRole,
      employeeHeadcount,
      preferredContact,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !workEmail || !companyName || !phoneNumber || !companyRole || !employeeHeadcount) {
     throw new AppError('All fields are required', 400, 'MISSING_FIELDS');
    }
  // Convert employeeHeadcount to an integer
  const headcount = parseInt(employeeHeadcount, 10);
  if (isNaN(headcount)) {
   throw new AppError('Invalid employeeHeadcount. Must be a number.', 422, 'VALIDATION_ERROR');
  }
    // Convert preferredContact to boolean (true = phone, false = email)
    const isPhonePreferred = preferredContact === 'phone';

    const demoRequest = await RequestDemoService.createRequestDemo(
      firstName,
      lastName,
      workEmail,
      companyName,
      phoneNumber,
      companyRole,
      employeeHeadcount,
      isPhonePreferred
    );

    res.status(201).json({ message: 'Demo request submitted successfully', data: demoRequest });
  } catch (error) {
    next(error);
  }
};