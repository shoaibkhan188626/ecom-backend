import asyncHandler from "../utils/asyncHandler.js";
import { getMe } from "../services/user.service.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user || (await getMe(req.auth.userId));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
