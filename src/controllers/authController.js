/* Authentication Controller - Handles auth logic */
const User = require('../models/User');
const { generateTokenPair, generateToken } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');
const { successResponse, errorResponse } = require('../utils/response');

// ============================================
// REGISTER - Create new user account
// ============================================
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    return errorResponse(
      res,
      HTTP_STATUS.CONFLICT,
      `${field} already registered`,
      ERROR_CODES.CONFLICT
    );
  }

  // Create new user
  const user = new User({
    username,
    email,
    password,
    firstName: firstName || '',
    lastName: lastName || '',
    isVerified: false,
    status: 'active',
  });

  await user.save();

  // Generate tokens
  const tokens = generateTokenPair(user._id, user.role);

  // Return response (without password)
  const userResponse = user.toJSON();

  return successResponse(res, HTTP_STATUS.CREATED, 'User registered successfully', {
    user: userResponse,
    tokens,
    message: 'Please verify your email to unlock all features',
  });
});

// ============================================
// LOGIN - Authenticate user
// ============================================
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists
  if (!user) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid email or password',
      ERROR_CODES.UNAUTHORIZED
    );
  }

  // Check if user is active
  if (user.status !== 'active') {
    return errorResponse(
      res,
      HTTP_STATUS.FORBIDDEN,
      `Account is ${user.status}. Please contact support.`,
      ERROR_CODES.FORBIDDEN
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid email or password',
      ERROR_CODES.UNAUTHORIZED
    );
  }

  // Update last login
  user.lastLoginDate = new Date();
  await user.save();

  // Generate tokens
  const tokens = generateTokenPair(user._id, user.role);

  // Return response
  const userResponse = user.toJSON();

  return successResponse(res, HTTP_STATUS.OK, 'Login successful', {
    user: userResponse,
    tokens,
  });
});

// ============================================
// LOGOUT - Invalidate user session
// ============================================
exports.logout = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // In production, you might:
  // 1. Add token to blacklist (database or Redis)
  // 2. Revoke refresh token
  // 3. Clear session data

  // For now, just acknowledge the logout on client side
  return successResponse(res, HTTP_STATUS.OK, 'Logout successful', {
    message: 'Token invalidated. Please remove it from client storage.',
  });
});

// ============================================
// REFRESH TOKEN - Get new access token
// ============================================
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Refresh token is required',
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  try {
    // Verify refresh token
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(refreshToken);

    // Check if token type is 'refresh'
    if (decoded.type !== 'refresh') {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'Invalid token type',
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);

    if (!user || user.status !== 'active') {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'User not found or inactive',
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Generate new tokens
    const newTokens = generateTokenPair(user._id, user.role);

    return successResponse(res, HTTP_STATUS.OK, 'Token refreshed successfully', {
      tokens: newTokens,
    });
  } catch (error) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid refresh token',
      ERROR_CODES.UNAUTHORIZED
    );
  }
});

// ============================================
// GET PROFILE - Retrieve current user profile
// ============================================
exports.getProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId)
    .populate('followers', 'username avatar')
    .populate('following', 'username avatar');

  if (!user) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'User not found',
      ERROR_CODES.NOT_FOUND
    );
  }

  return successResponse(res, HTTP_STATUS.OK, 'Profile retrieved successfully', {
    user: user.toJSON(),
  });
});

// ============================================
// UPDATE PROFILE - Update user profile
// ============================================
exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { firstName, lastName, bio, location, website, dateOfBirth } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      bio,
      location,
      website,
      dateOfBirth,
      updatedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'User not found',
      ERROR_CODES.NOT_FOUND
    );
  }

  return successResponse(res, HTTP_STATUS.OK, 'Profile updated successfully', {
    user: user.toJSON(),
  });
});

// ============================================
// CHANGE PASSWORD - Update user password
// ============================================
exports.changePassword = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  // Get user with password field
  const user = await User.findById(userId).select('+password');

  if (!user) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'User not found',
      ERROR_CODES.NOT_FOUND
    );
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Current password is incorrect',
      ERROR_CODES.UNAUTHORIZED
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return successResponse(res, HTTP_STATUS.OK, 'Password changed successfully', {
    message: 'Your password has been updated',
  });
});

// ============================================
// FORGOT PASSWORD - Request password reset
// ============================================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists (security best practice)
    return successResponse(res, HTTP_STATUS.OK, 'Check your email for reset link', {
      message: 'If an account exists, password reset link has been sent to email',
    });
  }

  // Generate reset token (valid for 1 hour)
  const resetToken = generateToken(user._id, 'reset', '1h');
  const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.verificationToken = resetToken;
  user.verificationTokenExpire = resetTokenExpire;
  await user.save();

  // In production, send email with reset link
  // Reset URL: /api/v1/auth/reset-password?token={resetToken}

  return successResponse(res, HTTP_STATUS.OK, 'Check your email for reset link', {
    message: 'Password reset link has been sent to your email',
    // developmentOnly: { resetToken }, // Remove in production
  });
});

// ============================================
// RESET PASSWORD - Complete password reset
// ============================================
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Reset token is required',
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  try {
    // Verify token
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user || user.verificationToken !== token) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'Invalid or expired reset token',
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Check if token expired
    if (new Date() > user.verificationTokenExpire) {
      return errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'Reset token has expired',
        ERROR_CODES.UNAUTHORIZED
      );
    }

    // Update password
    user.password = newPassword;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();

    return successResponse(res, HTTP_STATUS.OK, 'Password reset successfully', {
      message: 'Your password has been reset. Please login with new password.',
    });
  } catch (error) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid reset token',
      ERROR_CODES.UNAUTHORIZED
    );
  }
});

// ============================================
// VERIFY EMAIL - Confirm user email
// ============================================
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Verification token is required',
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  try {
    const { verifyToken } = require('../utils/jwt');
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(
        res,
        HTTP_STATUS.NOT_FOUND,
        'User not found',
        ERROR_CODES.NOT_FOUND
      );
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();

    return successResponse(res, HTTP_STATUS.OK, 'Email verified successfully', {
      message: 'Your email has been verified. Welcome to NexMeet!',
    });
  } catch (error) {
    return errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      'Invalid or expired verification token',
      ERROR_CODES.UNAUTHORIZED
    );
  }
});

// ============================================
// SEND VERIFICATION EMAIL - Resend email verification
// ============================================
exports.sendVerificationEmail = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    return errorResponse(
      res,
      HTTP_STATUS.NOT_FOUND,
      'User not found',
      ERROR_CODES.NOT_FOUND
    );
  }

  if (user.isVerified) {
    return successResponse(res, HTTP_STATUS.OK, 'Email already verified', {
      message: 'Your email is already verified',
    });
  }

  // Generate new verification token
  const verificationToken = generateToken(user._id, 'verify', '24h');
  const tokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  user.verificationToken = verificationToken;
  user.verificationTokenExpire = tokenExpire;
  await user.save();

  // In production, send email with verification link
  // Verify URL: /api/v1/auth/verify-email?token={verificationToken}

  return successResponse(res, HTTP_STATUS.OK, 'Verification email sent', {
    message: 'Please check your email for verification link',
  });
});

// ============================================
// GOOGLE OAUTH CALLBACK - Handle Google login
// ============================================
exports.googleCallback = asyncHandler(async (req, res) => {
  const { googleId, email, name, picture } = req.body;

  if (!googleId || !email) {
    return errorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Google ID and email are required',
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (!user) {
    // Create new user from Google data
    const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);

    user = new User({
      googleId,
      email,
      username,
      firstName: name?.split(' ')[0] || '',
      lastName: name?.split(' ').slice(1).join(' ') || '',
      avatar: {
        url: picture,
      },
      isVerified: true, // Google verified emails
      status: 'active',
      password: Math.random().toString(36), // Random password for security
    });

    await user.save();
  }

  // Update Google ID if not set
  if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }

  // Check if user is active
  if (user.status !== 'active') {
    return errorResponse(
      res,
      HTTP_STATUS.FORBIDDEN,
      `Account is ${user.status}. Please contact support.`,
      ERROR_CODES.FORBIDDEN
    );
  }

  // Update last login
  user.lastLoginDate = new Date();
  await user.save();

  // Generate tokens
  const tokens = generateTokenPair(user._id, user.role);

  const userResponse = user.toJSON();

  return successResponse(res, HTTP_STATUS.OK, 'Google login successful', {
    user: userResponse,
    tokens,
  });
});
