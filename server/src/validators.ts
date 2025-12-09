import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/)
  .regex(/[!@#$%^&*(),.?":{}|<>]/);

export const emailSchema = z.string().email();

export const nameSchema = z.string().min(20).max(60);

export const addressSchema = z.string().max(400);

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const addUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  role: z.enum(["admin", "normal_user", "store_owner"]),
});

export const addStoreSchema = z.object({
  name: nameSchema,
  address: addressSchema,
  ownerId: z.string().min(1),
});

export const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
});
