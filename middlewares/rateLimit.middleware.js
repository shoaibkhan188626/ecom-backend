import rateLimit from "express-rate-limit";
import AppError from "../utils/appError";

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many Requests from this IP, Please try again later",
        429,
      ),
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    new AppError(
      "Too many authentication attempts. Please wait and try again.",
      429,
    );
  },
});
