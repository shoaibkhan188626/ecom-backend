import express from "express";

import requireAuth from "../middlewares/requireAuth.js";
import requirePermission from "../middlewares/requirePermission.js";
import validate from "../middlewares/validate.middleware.js";
import { PERMISSIONS } from "../utils/constants.js";
import * as productController from "../controllers/product.controller.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.schema.js";

const router = express.Router();

router.get(
  "/",
  requireAuth,
  requirePermission,
  PERMISSIONS.PRODUCT_READ,
  productController.list,
);

router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.PRODUCT_CREATE),
  validate(createProductSchema),
  productController.create,
);

router.patch(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.PRODUCT_UPDATE),
  validate(updateProductSchema),
  productController.update,
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.PRODUCT_DELETE),
  productController.remove,
);

export default router;
