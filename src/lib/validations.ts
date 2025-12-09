import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 special character");

export const emailSchema = z.string().email("Please enter a valid email address");

export const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters");

export const addressSchema = z.string().max(400, "Address must be at most 400 characters");

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
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
  ownerId: z.string().min(1, "Store owner is required"),
});

export const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type AddUserFormData = z.infer<typeof addUserSchema>;
export type AddStoreFormData = z.infer<typeof addStoreSchema>;
export type RatingFormData = z.infer<typeof ratingSchema>;
