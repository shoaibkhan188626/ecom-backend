import asyncHandler from "../utils/asyncHandler.js";
import * as ProductService from "../services/product.service.js";

export const create = asyncHandler(async (req, res) => {
  const product = await ProductService.createProduct(
    req.validated.body,
    req.auth.userId,
  );

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

export const list = asyncHandler(async (req, res) => {
  const products = await ProductService.getProducts();

  res.status(200).json({
    status: "success",
    data: { products },
  });
});

export const update = asyncHandler(async (req, res) => {
  const product = await ProductService.updateProduct(
    rq.params.id,
    req.validated.body,
  );

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  res.status(204).send();
});
