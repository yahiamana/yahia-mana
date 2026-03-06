"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ label, value, onChange, folder = "portfolio" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Get signed upload parameters from our API
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-file-type": file.type 
        },
        body: JSON.stringify({ folder }),
      });

      const signData = await signRes.json();
      if (!signData.success) throw new Error(signData.error || "Failed to get upload signature");

      const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = signData.data;

      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", targetFolder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();
      if (cloudinaryData.error) throw new Error(cloudinaryData.error.message);

      // 3. Return the secure URL
      onChange(cloudinaryData.secure_url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94A3B8", marginBottom: "0.5rem" }}>
        {label}
      </label>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "1rem",
        padding: "1rem",
        background: "rgba(11, 15, 26, 0.3)",
        border: "1px dashed rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        minHeight: "100px",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {value ? (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden" }}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={value} 
              alt="Preview" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
            <button
              onClick={() => onChange("")}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "rgba(239, 68, 68, 0.8)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px"
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "0.5rem" }}>
              {uploading ? "Uploading to Cloud..." : "PNG, JPG or WebP (Max 10MB)"}
            </p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3B82F6",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {uploading ? "Processing..." : "Choose Photo"}
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          style={{ display: "none" }}
        />

        {error && (
          <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: "0.5rem", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
