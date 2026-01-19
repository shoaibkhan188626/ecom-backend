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

export const getAllUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const users = (await User.find().skip(skip).limit(limit)).sort({
    createdAt: -1,
  });

  const total = await User.countDocuments();

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
