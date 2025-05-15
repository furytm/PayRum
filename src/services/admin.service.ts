
import {prisma} from '../prisma/client'; // Prisma client
import bcrypt from 'bcryptjs';
import { generateOTP } from '../utils/otpGenerator';
import { sendOTPEmail } from '../utils/emailSender';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// Admin Service to handle business logic

export const signup = async (email: string, password: string): Promise<string> => {
    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });
  
    if (existingAdmin) {
      throw new AppError('Admin with this email already exists', 409, 'Email_Exists');
    }
  
    // Generate OTP
    const otp = generateOTP();
    await sendOTPEmail(email, otp);
  
    // Save admin in the database with hashed password and OTP
    await prisma.admin.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),  // Hash the password
        otp,
      },
    });
  
    return otp; // Return OTP for later comparison (you could store it temporarily in memory or DB)
  };
  
  export const verifyOTPAndCreateToken = async (email: string, otp: string): Promise<string> => {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
  
    if (!admin) {
      throw new AppError('Admin not found', 404, 'Admin_not_found');
    }
  
    // Compare OTP received with the one stored in the database
    if (otp !== admin.otp) {
      throw new AppError('Invalid OTP',404,'Invald_otp');
    }
  
    // OTP is valid, generate JWT token for admin
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  
    // Optionally, delete the OTP after successful verification
    await prisma.admin.update({
      where: { email },
      data: { otp: null }, // Remove OTP from the admin record
    });
  
    return token; // Return the JWT token
  };
  
  export const login = async (email: string, password: string): Promise<string> => {
    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
  
     if (!admin) {
      throw new AppError('Admin not found', 404, 'Admin_not_found');
    }
    // Compare password with hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid password',404);
    }
  
    // Generate JWT token for the logged-in admin
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  
    return token; // Return the JWT token
  };