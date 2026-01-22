import jwt from "jsonwebtoken";
import redis from "../services/redis.service.js";
import User from "../models/user.model.js";
import AppError from "../utils/appError.js";

const CACHE_TILL = 3000;

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }

  const cacheKey = `user:${payload.userId}`;
  const cachedUser = await redis.get(cacheKey);

  if (cachedUser) {
    req.auth = payload;
    req.user = JSON.parse(cachedUser);
    return next();
  }

  const user = await User.findById(payload.userId);

  if (!user || !user.isActive || user.isBlocked) {
    return next(new AppError("Account disabled", 403));
  }

  await redis.set(cacheKey, JSON.stringify(user), "EX", CACHE_TILL);
  req.auth = payload;
  req.user = user;
  next();
};

export default requireAuth;
