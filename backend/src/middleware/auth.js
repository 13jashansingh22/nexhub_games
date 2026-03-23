/* JWT Authentication Middleware */
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.cookies?.authToken;

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_CODES.UNAUTHORIZED,
        message: 'No authentication token provided',
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_CODES.UNAUTHORIZED,
        message: 'Token has expired',
      });
    }

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_CODES.UNAUTHORIZED,
      message: 'Invalid token',
    });
  }
};

// Optional auth middleware - doesn't fail if no token
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.cookies?.authToken;

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      req.user = decoded;
      req.isAuthenticated = true;
    } else {
      req.isAuthenticated = false;
    }

    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
};
