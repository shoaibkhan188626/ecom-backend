import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

/* -------------------------------------------------
   TOKEN HELPERS
-------------------------------------------------- */

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

/* -------------------------------------------------
   REGISTER USER
-------------------------------------------------- */

export const registerUser = async ({ email, password, phone }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = new User({
    email,
    phone,
  });

  user.password = password; // virtual setter
  await user.save();

  return user;
};

/* -------------------------------------------------
   LOGIN USER
-------------------------------------------------- */

export const loginUser = async ({ email, password, ip }) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive || user.isBlocked) {
    throw new AppError('Account is disabled', 403);
  }

  if (user.isAccountLocked()) {
    throw new AppError('Account temporarily locked', 423);
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    user.markLoginFailure();
    await user.save();
    throw new AppError('Invalid credentials', 401);
  }

  user.markLoginSuccess(ip);
  await user.save();

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
  });

  const hashedRefreshToken = hashToken(refreshToken);

  user.refreshTokenHash = hashedRefreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/* -------------------------------------------------
   REFRESH TOKEN ROTATION
-------------------------------------------------- */

export const refreshAuthToken = async (refreshToken) => {
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const hashedToken = hashToken(refreshToken);

  const user = await User.findOne({
    _id: payload.userId,
    refreshTokenHash: hashedToken,
  });

  if (!user) {
    throw new AppError('Refresh token reuse detected', 401);
  }

  // Rotate token
  const newAccessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const newRefreshToken = signRefreshToken({
    userId: user.id,
  });

  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
