import AppError from "../utils/appError.js";

const requirePermission = (...requirePermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication Required", 403));
    }

    const userPermissions = req.user.permissions || [];

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};

export default requirePermission;
