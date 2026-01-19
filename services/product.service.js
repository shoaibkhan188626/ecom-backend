import Product from "../models/product.model.js";
import AppError from "../utils/appError.js";

export const createProduct = async (data, userId) => {
  return Product.create({
    ...data,
    createdBy: userId,
  });
};

export const getProducts = async () => {
  return Product.find({ isActive: true }).sort({ createdAt: -1 });
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};
