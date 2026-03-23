/* JWT Utility Functions */
const jwt = require('jsonwebtoken');
const config = require('../config/env');

// Generate JWT token
const generateToken = (userId, role = 'user', expiresIn = config.JWT_EXPIRE) => {
  return jwt.sign(
    {
      userId,
      role,
      iat: Date.now(),
    },
    config.JWT_SECRET,
    {
      expiresIn,
    }
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: 'refresh',
    },
    config.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

// Verify token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

// Generate tokens pair (access + refresh)
const generateTokenPair = (userId, role = 'user') => {
  return {
    accessToken: generateToken(userId, role),
    refreshToken: generateRefreshToken(userId),
  };
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateTokenPair,
};
