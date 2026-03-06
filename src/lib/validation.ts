import { z } from "zod";

/**
 * Zod validation schemas used across API routes.
 * All user input must be validated before processing.
 */

// ─── Auth Schemas ───

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  totpCode: z.string().length(6).optional(), // Optional 2FA code
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

export const verify2faSchema = z.object({
  code: z.string().length(6, "TOTP code must be 6 digits"),
});

// ─── Project Schemas ───

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  summary: z.string().min(1, "Summary is required").max(500),
  contentMDX: z.string().min(1, "Content is required"),
  featuredUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  techTags: z.array(z.string().max(50)).max(20).optional().default([]),
  metrics: z.record(z.string()).nullable().optional(),
  published: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  gallery: z.array(z.string().url()).optional().default([]), // Array of Cloudinary URLs
});

export const updateProjectSchema = createProjectSchema.partial();

// ─── Contact Schema ───

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

// ─── Media Schema ───

export const signUploadSchema = z.object({
  folder: z.string().max(100).optional().default("portfolio"),
});

// ─── User Management Schemas ───

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters"),
  role: z.enum(["ADMIN", "EDITOR"]),
});

export const updateUserSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
  isActive: z.boolean().optional(),
});

// ─── Site Settings Schema ───

export const siteSettingsSchema = z.object({
  siteTitle: z.string().max(200).optional(),
  siteTagline: z.string().max(500).optional(),
  heroHeading: z.string().max(500).optional(),
  heroSubheading: z.string().max(1000).optional(),
  heroCta: z.string().max(100).optional(),
  heroCtaLink: z.string().max(500).optional(),
  aboutText: z.string().max(10000).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  socialGithub: z.string().url().optional().or(z.literal("")),
  socialLinkedin: z.string().url().optional().or(z.literal("")),
  socialTwitter: z.string().url().optional().or(z.literal("")),
  metaOgImage: z.string().max(500).optional(),
});
