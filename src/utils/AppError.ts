export class AppError extends Error {
  status: number;
  code: string;
  errors?: any;

  constructor(message: string, status = 500, code = 'SERVER_ERROR', errors?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
