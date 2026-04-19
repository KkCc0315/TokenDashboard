import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const watchlistItemSchema = z.object({
  tokenId: z.string().trim().min(1, "Token is required"),
  note: z.string().trim().min(1, "Note is required"),
  targetPrice: z
    .number({ invalid_type_error: "Target price must be a number" })
    .positive("Target price must be positive"),
  alertCondition: z.enum(["ABOVE", "BELOW"]).default("ABOVE")
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address")
});

export const preferencesSchema = z.object({
  theme: z.string().trim().default("system"),
  defaultChain: z.string().trim().default("All"),
  compactNumbers: z.boolean().default(true)
});
