import { Request, Response, NextFunction } from 'express';
import { RequestDemoService } from '../services/demoRequest';

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
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
  // Convert employeeHeadcount to an integer
  const headcount = parseInt(employeeHeadcount, 10);
  if (isNaN(headcount)) {
    res.status(400).json({ message: 'Invalid employeeHeadcount. Must be a number.' });
    return;
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