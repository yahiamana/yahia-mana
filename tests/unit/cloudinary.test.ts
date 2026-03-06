import { describe, it, expect } from "vitest";
import { cloudinaryUrl, generateSrcSet, isAllowedFileType, isAllowedFileSize } from "@/lib/cloudinary";

describe("cloudinaryUrl", () => {
  it("generates a URL with default transforms", () => {
    // Set the env var for the test
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test-cloud";
    const url = cloudinaryUrl("portfolio/hero.jpg");
    expect(url).toContain("test-cloud");
    expect(url).toContain("c_fill");
    expect(url).toContain("q_auto");
    expect(url).toContain("f_auto");
    expect(url).toContain("portfolio/hero.jpg");
  });

  it("includes width and height when specified", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test-cloud";
    const url = cloudinaryUrl("test.jpg", { width: 800, height: 600 });
    expect(url).toContain("w_800");
    expect(url).toContain("h_600");
  });
});

describe("generateSrcSet", () => {
  it("generates multiple width entries", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "test-cloud";
    const srcSet = generateSrcSet("test.jpg", [320, 640]);
    expect(srcSet).toContain("320w");
    expect(srcSet).toContain("640w");
    expect(srcSet.split(", ")).toHaveLength(2);
  });
});

describe("isAllowedFileType", () => {
  it("allows valid image types", () => {
    expect(isAllowedFileType("image/jpeg")).toBe(true);
    expect(isAllowedFileType("image/png")).toBe(true);
    expect(isAllowedFileType("image/webp")).toBe(true);
  });

  it("rejects invalid types", () => {
    expect(isAllowedFileType("application/pdf")).toBe(false);
    expect(isAllowedFileType("text/html")).toBe(false);
  });
});

describe("isAllowedFileSize", () => {
  it("allows images under 10MB", () => {
    expect(isAllowedFileSize(5 * 1024 * 1024, "image/jpeg")).toBe(true);
  });

  it("rejects images over 10MB", () => {
    expect(isAllowedFileSize(15 * 1024 * 1024, "image/jpeg")).toBe(false);
  });

  it("allows videos under 100MB", () => {
    expect(isAllowedFileSize(50 * 1024 * 1024, "video/mp4")).toBe(true);
  });
});
