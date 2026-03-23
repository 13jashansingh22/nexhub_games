/* Request Validation Middleware */
const { validationResult } = require('express-validator');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: ERROR_CODES.VALIDATION_ERROR,
      message: 'Validation failed',
      details: formattedErrors,
    });
  }

  next();
};

// Request size limiter
const requestSizeLimiter = (maxSize = '50mb') => {
  const express = require('express');
  return [
    express.json({ limit: maxSize }),
    express.urlencoded({ limit: maxSize, extended: true }),
  ];
};

module.exports = {
  handleValidationErrors,
  requestSizeLimiter,
};
