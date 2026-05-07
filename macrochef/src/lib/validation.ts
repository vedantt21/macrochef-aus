import { z } from "zod";

const email = z.string().trim().email().max(255).toLowerCase();
const username = z
  .string()
  .trim()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only")
  .transform((value) => value.toLowerCase());
const macro = z.coerce.number().int().min(0).max(10000);
const shortText = z.string().trim().min(1).max(255);
const optionalText = z.string().trim().max(2000).optional().nullable();
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const registerSchema = z.object({
  email,
  username,
  displayName: shortText.max(80),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(255),
  password: z.string().min(1).max(128),
});

export const verifyEmailSchema = z.object({
  email,
  code: z.string().trim().regex(/^\d{6}$/),
});

export const resendVerificationSchema = z.object({ email });

export const profileUpdateSchema = z.object({
  displayName: shortText.max(80).optional(),
  bio: z.string().trim().max(500).optional().nullable(),
  dailyCalorieGoal: macro.optional(),
  proteinGoal: macro.optional(),
  carbsGoal: macro.optional(),
  fatGoal: macro.optional(),
  isPrivate: z.boolean().optional(),
});

export const foodLogSchema = z.object({
  foodName: shortText.max(120),
  calories: macro,
  protein: macro,
  carbs: macro,
  fat: macro,
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"]),
  servingSize: z.string().trim().max(80).optional().nullable(),
  notes: optionalText,
  logDate: dateString,
});

export const foodLogUpdateSchema = foodLogSchema.partial();

export const recipeSchema = z.object({
  title: shortText.max(120),
  description: z.string().trim().min(1).max(600),
  imageUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  ingredients: z.string().trim().min(1).max(5000),
  instructions: z.string().trim().min(1).max(8000),
  calories: macro,
  protein: macro,
  carbs: macro,
  fat: macro,
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  visibility: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).default("PUBLIC"),
});

export const recipeUpdateSchema = recipeSchema.partial();

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});

export const recipeLogSchema = z.object({
  logDate: dateString,
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"]),
  servingSize: z.string().trim().max(80).optional().nullable(),
  notes: optionalText,
});

export const friendRequestSchema = z.object({
  receiverId: z.string().min(1),
});
