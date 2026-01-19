import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { registerUser, loginUser, refreshAuthToken } from '../services/auth.service.js';
import { validate, registerUserSchema, loginUserSchema } from '../validators/user.schema.js';

export const register = asyncHandler(async (req, res) => {
  const data = validate(registerUserSchema)(req.body);

  const user = await registerUser(data);

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const data = validate(loginUserSchema)(req.body);

  const { user, accessToken, refreshToken } = await loginUser({
    ...data,
    ip: req.ip,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body?.refreshToken || req.headers['x-refresh-token'];

  if (!refreshToken) {
    throw new AppError('refresh token required', 400);
  }

  const tokens = await refreshAuthToken(refreshToken);

  res.status(200).json({
    status: 'success',
    data: tokens,
  });
});
