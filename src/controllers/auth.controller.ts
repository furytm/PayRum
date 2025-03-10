import { Request, Response,NextFunction } from 'express';
import { signup,verifyOTPAndCreateToken,login } from '../services/admin.service';

// Admin Signup Route
export const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Call service method to handle signup logic
    const otp = await signup(email, password);
    res.status(200).json({
      message: 'OTP sent to email. Please check your inbox.',
      otp, // You might not want to return OTP directly in a real-world scenario
    });
  } catch (error) {
    next(error); 
  }
};
// Admin Login Route
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
  
    try {
      // Call service method to handle login logic
      const token = await login(email, password);
      res.status(200).json({
        message: 'Login successful',
        token, // JWT token returned after successful login
      });
    } catch (error) {
      next(error);
    }
  };

// OTP Verification Route
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;

  try {
    // Call service method to handle OTP verification and JWT generation
    const token = await verifyOTPAndCreateToken(email, otp);
    res.status(200).json({
      message: 'OTP verified successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};
