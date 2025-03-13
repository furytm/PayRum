
import {prisma} from '../prisma/client'; // Prisma client
import bcrypt from 'bcryptjs';
import { generateOTP } from '../utils/otpGenerator';
import { sendOTPEmail } from '../utils/emailSender';
import jwt from 'jsonwebtoken';

// Admin Service to handle business logic

export const signup = async (email: string, password: string): Promise<string> => {
    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });
  
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
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
      throw new Error('Admin not found');
    }
  
    // Compare OTP received with the one stored in the database
    if (otp !== admin.otp) {
      throw new Error('Invalid OTP');
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
      throw new Error('Admin not found');
    }
  
    // Compare password with hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
  
    // Generate JWT token for the logged-in admin
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
  
    return token; // Return the JWT token
  };