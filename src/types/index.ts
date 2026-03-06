/** Shared TypeScript types used across the application */

export type { Role } from "@prisma/client";

/** JWT payload stored in access tokens */
export interface JWTPayload {
  sub: string; // AdminUser ID
  email: string;
  role: "ADMIN" | "EDITOR";
  iat: number;
  exp: number;
}

/** Public-facing project data (safe to serialize) */
export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  contentMDX: string;
  featuredUrl: string | null;
  techTags: string[];
  metrics: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

/** API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/** Cloudinary signed upload params returned to the client */
export interface CloudinarySignedParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset?: string;
  folder?: string;
}

/** Media item for display */
export interface MediaItem {
  id: string;
  publicId: string;
  url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  alt: string | null;
  createdAt: string;
}

/** Audit log entry for display */
export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail?: string;
  action: string;
  target: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
}
