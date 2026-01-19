import express from "express";

import requireAuth from "../middlewares/requireAuth.js";
import requireRole from "../middlewares/requireRole.js";
import { listUsers } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", requireAuth, requireRole("admin"), listUsers);
export default router;
