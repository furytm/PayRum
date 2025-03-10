import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to protect routes by verifying JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction):void => {
  // Get the token from the Authorization header (bearer token)
  const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
     res.status(401).json({ message: 'Unauthorized: No token provided' });
     return;
  }

  // Verify the token using JWT secret
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    // If the token is valid, attach the decoded payload (user info) to the request
    req.user = decoded; // You can attach any user data you want here
    next(); // Move to the next middleware or route handler
  });
};
