import { describe, it, expect } from "vitest";
import { loginSchema, createProjectSchema, contactSchema, resetPasswordSchema } from "@/lib/validation";

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "admin@test.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "admin@test.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional TOTP code", () => {
    const result = loginSchema.safeParse({
      email: "admin@test.com",
      password: "password123",
      totpCode: "123456",
    });
    expect(result.success).toBe(true);
  });
});

describe("createProjectSchema", () => {
  it("accepts valid project data", () => {
    const result = createProjectSchema.safeParse({
      title: "Test Project",
      slug: "test-project",
      summary: "A test project",
      contentMDX: "# Test content",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug format", () => {
    const result = createProjectSchema.safeParse({
      title: "Test",
      slug: "Invalid Slug!",
      summary: "Summary",
      contentMDX: "Content",
    });
    expect(result.success).toBe(false);
  });

  it("sets defaults for optional fields", () => {
    const result = createProjectSchema.safeParse({
      title: "Test",
      slug: "test",
      summary: "Summary",
      contentMDX: "Content",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.techTags).toEqual([]);
      expect(result.data.published).toBe(false);
    }
  });
});

describe("contactSchema", () => {
  it("rejects short messages", () => {
    const result = contactSchema.safeParse({
      name: "Test",
      email: "test@test.com",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "Test User",
      email: "test@test.com",
      message: "This is a valid message with enough characters.",
    });
    expect(result.success).toBe(true);
  });
});

describe("resetPasswordSchema", () => {
  it("requires strong passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "some-token",
      newPassword: "weak",
    });
    expect(result.success).toBe(false);
  });

  it("accepts strong passwords", () => {
    const result = resetPasswordSchema.safeParse({
      token: "some-token",
      newPassword: "Str0ng!Pass@word",
    });
    expect(result.success).toBe(true);
  });
});
