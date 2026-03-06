import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary integration utilities.
 * Uses server-side signed uploads for security — clients never see the API secret.
 */

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
});

export { cloudinary };

// ─── Allowed file types and size limits ───

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

// ─── Responsive breakpoints for srcset generation ───

const DEFAULT_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1536, 1920];

/**
 * Generate a responsive Cloudinary URL with transformations.
 * 
 * @param publicId — Cloudinary public ID
 * @param options — optional transforms (width, height, quality, format)
 * @returns Fully qualified Cloudinary URL
 */
export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    crop?: "fill" | "fit" | "scale" | "thumb" | "limit";
    gravity?: "auto" | "face" | "center";
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_${crop}`);
  transforms.push(`g_${gravity}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transformString = transforms.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Generate a srcset string for responsive images.
 * Outputs multiple widths with Cloudinary auto-format and auto-quality.
 * 
 * Usage in React:
 *   <img srcSet={generateSrcSet("portfolio/hero.jpg")} sizes="100vw" />
 */
export function generateSrcSet(
  publicId: string,
  widths: number[] = DEFAULT_WIDTHS
): string {
  return widths
    .map((w) => `${cloudinaryUrl(publicId, { width: w })} ${w}w`)
    .join(", ");
}

/**
 * Generate signed upload parameters for secure direct client uploads.
 * The client uses these params to upload directly to Cloudinary
 * without exposing the API secret.
 */
export function generateSignedUploadParams(options: {
  folder?: string;
  maxFileSize?: number;
}): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
} {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = options.folder || "portfolio";

  // Parameters to sign — must match what the client sends
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
  };
}

/**
 * Validate that a file type is allowed for upload.
 */
export function isAllowedFileType(mimeType: string): boolean {
  return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(mimeType);
}

/**
 * Validate that a file size is within limits.
 */
export function isAllowedFileSize(bytes: number, mimeType: string): boolean {
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return bytes <= MAX_VIDEO_SIZE;
  }
  return bytes <= MAX_IMAGE_SIZE;
}
