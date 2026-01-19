import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  }),
});
