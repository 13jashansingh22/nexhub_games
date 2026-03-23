/* Authentication Routes */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
  validateUpdateProfile,
  validateGoogleCallback,
} = require('../middleware/authValidation');
const { handleValidationErrors } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 * @body    { username, email, password, firstName?, lastName? }
 */
router.post('/register', validateRegister, handleValidationErrors, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get tokens
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', validateLogin, handleValidationErrors, authController.login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    { refreshToken }
 */
router.post(
  '/refresh',
  validateRefreshToken,
  handleValidationErrors,
  authController.refreshToken
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 * @body    { email }
 */
router.post(
  '/forgot-password',
  validateForgotPassword,
  handleValidationErrors,
  authController.forgotPassword
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 * @body    { token, newPassword }
 */
router.post(
  '/reset-password',
  validateResetPassword,
  handleValidationErrors,
  authController.resetPassword
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 * @body    { token }
 */
router.post(
  '/verify-email',
  validateVerifyEmail,
  handleValidationErrors,
  authController.verifyEmail
);

/**
 * @route   POST /api/v1/auth/google
 * @desc    Google OAuth login/signup
 * @access  Public
 * @body    { googleId, email, name?, picture? }
 */
router.post(
  '/google',
  validateGoogleCallback,
  handleValidationErrors,
  authController.googleCallback
);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { firstName?, lastName?, bio?, location?, website?, dateOfBirth? }
 */
router.put(
  '/profile',
  authMiddleware,
  validateUpdateProfile,
  handleValidationErrors,
  authController.updateProfile
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { currentPassword, newPassword }
 */
router.post(
  '/change-password',
  authMiddleware,
  validateChangePassword,
  handleValidationErrors,
  authController.changePassword
);

/**
 * @route   POST /api/v1/auth/send-verification-email
 * @desc    Resend email verification
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post(
  '/send-verification-email',
  authMiddleware,
  authController.sendVerificationEmail
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (invalidate token)
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
