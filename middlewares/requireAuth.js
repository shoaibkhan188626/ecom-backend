import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '@/models/user.model.js';

const requireAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication Required', 401));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    return next(new AppError('Invalid token', 401));
  }

  req.auth = {
    userId: payload.userId,
    role: payload.role,
  };

  const user = await User.findById(payload.userId);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  if (!user.isActive || user.isBlocked) {
    return next(new AppError('account disabled', 403));
  }
  req.user = user;
  next();
};

export default requireAuth;
