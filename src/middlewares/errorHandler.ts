import { Request, Response, NextFunction } from 'express';

// Define the error type
interface CustomError extends Error {
  status?: number;
  errors?: any; // Optional detailed error messages
}

// Error Handler Middleware
const errorHandler = (
  err: unknown, 
  req: Request, 
  res: Response, 
  next: NextFunction
): Response => {
  
  // Ensure the error is of type `CustomError`
  const error = err as CustomError;
  
  console.error(error.stack || error.message); // Log error details

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid input data',
      details: error.errors || [],
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token provided',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token has expired',
    });
  }

  // Default error handler for all other errors
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Something went wrong on the server. Please try again later.',
  });
};

export { errorHandler };
