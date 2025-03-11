// import { Request, Response, NextFunction } from 'express';
// import { createDemoRequest } from '../services/demoRequest';

// export const requestDemo = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const demoRequest = await createDemoRequest(req.body);
//     res.status(201).json({
//       message: 'Demo request submitted successfully',
//       data: demoRequest,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
