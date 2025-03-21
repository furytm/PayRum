import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string; // A custom error code, if available
  errors?: any;  // Optional detailed error messages
}

const errorHandler = (
  err: unknown, 
  req: Request, 
  res: Response, 
  next: NextFunction
): Response => {
  // Cast error to CustomError
  const error = err as CustomError;

  // Log detailed error information for debugging
  console.error("Error occurred:", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Prepare a default friendly message
  let friendlyMessage = 'Something went wrong on the server. Please try again later.';
  let statusCode = error.status || 500;
  let errorCode = error.code || 'SERVER_ERROR';
  let detailedErrors = error.errors || [];

  // Specific error handling
  if (error.name === 'ValidationError') {
    friendlyMessage = 'Invalid input data. Please check your request.';
    statusCode = 400;
  } else if (error.name === 'JsonWebTokenError') {
    friendlyMessage = 'Invalid token provided. Please log in again.';
    statusCode = 401;
  } else if (error.name === 'TokenExpiredError') {
    friendlyMessage = 'Your session has expired. Please log in again.';
    statusCode = 401;
  }

  // In development, include the stack trace
  const responsePayload: any = {
    success: false,
    error: {
      code: errorCode,
      message: friendlyMessage,
      timestamp: new Date().toISOString(),
    },
  };

  if (process.env.NODE_ENV === 'development') {
    responsePayload.error.details = detailedErrors;
    responsePayload.error.stack = error.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export { errorHandler };
