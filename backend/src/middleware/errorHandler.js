/* Global Error Handler Middleware */
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

class AppError extends Error {
  constructor(message, statusCode = 500, code = ERROR_CODES.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Default error
  let error = {
    statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Server Error',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');

    error = {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: messages,
      details: isDevelopment ? err.errors : undefined,
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = {
      statusCode: HTTP_STATUS.CONFLICT,
      code: ERROR_CODES.CONFLICT,
      message: `${field} already exists`,
    };
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid ID format',
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid token',
    };
  }

  // Log error
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    status: error.statusCode,
    message: error.message,
    stack: isDevelopment ? err.stack : undefined,
  });

  // Send response
  res.status(error.statusCode).json({
    success: false,
    error: error.code,
    message: error.message,
    ...(isDevelopment && { details: error.details, stack: err.stack }),
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
};
