import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email format').toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z.string().min(10).max(15).optional();

export const registerUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  phone: phoneSchema,
  isActive: z.boolean().optional(),
});

export const validate = (schema) => (data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    const error = new Error('validation failed');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }
  return result.data;
};
