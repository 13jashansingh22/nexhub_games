/* Environment Configuration */
require('dotenv').config();

const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_default_secret_change_this',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Cloudinary
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // URLs
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MOBILE_APP_URL: process.env.MOBILE_APP_URL,

  // API
  API_VERSION: 'v1',
  API_BASE_URL: '/api/v1',

  isDevelopment: () => config.NODE_ENV === 'development',
  isProduction: () => config.NODE_ENV === 'production',
};

// Validate critical environment variables
const validateEnv = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && config.isProduction()) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

validateEnv();

module.exports = config;
