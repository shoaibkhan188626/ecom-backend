import User from "../models/user.model.js";
import AppError from "../utils/appError.js";

export const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found ", 404);
  }

  if (!user.isActive || user.isBlocked) {
    throw new AppError("Account disabled", 403);
  }
  return user;
};
