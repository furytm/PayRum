import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client'; // Needed for Prisma error handling

interface CustomError extends Error {
  status?: number;
  code?: string;
  errors?: any;
}

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const error = err as CustomError;

  const env = process.env.NODE_ENV || 'development';

  // Defaults
  let statusCode = error.status || 500;
  let message = error.message || 'Something went wrong';
  let errorCode = error.code || 'SERVER_ERROR';

  // Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    errorCode = error.code;
    message = `Prisma Error: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation error from database';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const responsePayload = {
    success: false,
    error: {
      message,
      code: errorCode,
      ...(env === 'development' && {
        stack: error.stack,
        path: req.path,
        method: req.method,
      }),
    },
  };

  console.error(`[${req.method}] ${req.path} - ${message}`);

  return res.status(statusCode).json(responsePayload);
};

export { errorHandler };
