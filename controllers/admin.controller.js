import asyncHandler from "../utils/asyncHandler.js";
import { getAllUsers } from "../services/user.service.js";

export const listUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await getAllUsers({ page, limit });

  res.status(200).json({
    status: "success",
    data: result,
  });
});
