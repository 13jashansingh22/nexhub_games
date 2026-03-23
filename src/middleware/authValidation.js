/* Authentication Validation Rules */
const { body, validationResult } = require('express-validator');

// ============================================
// REGISTER VALIDATION
// ============================================
exports.validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
];

// ============================================
// LOGIN VALIDATION
// ============================================
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ============================================
// REFRESH TOKEN VALIDATION
// ============================================
exports.validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid token format'),
];

// ============================================
// CHANGE PASSWORD VALIDATION
// ============================================
exports.validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password cannot be same as current password');
      }
      return true;
    }),
];

// ============================================
// FORGOT PASSWORD VALIDATION
// ============================================
exports.validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
];

// ============================================
// RESET PASSWORD VALIDATION
// ============================================
exports.validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
];

// ============================================
// VERIFY EMAIL VALIDATION
// ============================================
exports.validateVerifyEmail = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid token format'),
];

// ============================================
// UPDATE PROFILE VALIDATION
// ============================================
exports.validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 13) {
        throw new Error('You must be at least 13 years old');
      }
      return true;
    }),
];

// ============================================
// GOOGLE CALLBACK VALIDATION
// ============================================
exports.validateGoogleCallback = [
  body('googleId')
    .notEmpty()
    .withMessage('Google ID is required'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),

  body('picture')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid picture URL'),
];
