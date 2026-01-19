import AppError from "../utils/appError.js";

const requireRole = (...roles) => {
  return (req, res, next) => {
    if ((!req, auth?.role)) {
      return nextTick(new AppError("authentication required", 401));
    }

    if (!roles.includes(req.auth.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403),
      );
    }

    next();
  };
};

export default requireRole;
