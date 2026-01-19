import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh", authRateLimiter, refresh);
router.post("/logout", requireAuth, logout);

export default router;
