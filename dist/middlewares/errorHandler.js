"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Ensure the error is of type `CustomError`
    const error = err;
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
exports.errorHandler = errorHandler;
