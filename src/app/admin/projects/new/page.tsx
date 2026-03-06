"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { getCsrfToken } from "@/lib/csrf-client";

import FormLabel from "@/components/FormLabel";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    contentMDX: "",
    techTagsString: "",
    published: false,
    featuredUrl: "",
    liveUrl: "",
    githubUrl: "",
    sortOrder: 0,
    metrics: [{ key: "", value: "" }],
  });

  const [gallery, setGallery] = useState<string[]>([]);
  const [isSlugManual, setIsSlugManual] = useState(false);

  const handleTitleChange = (title: string) => {
    const changes: any = { title };
    if (!isSlugManual) {
      changes.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    setFormData({ ...formData, ...changes });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { key: "", value: "" }]
    });
  };

  const updateMetric = (index: number, field: "key" | "value", val: string) => {
    const newMetrics = [...formData.metrics];
    newMetrics[index][field] = val;
    setFormData({ ...formData, metrics: newMetrics });
  };

  const removeMetric = (index: number) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.filter((_, i) => i !== index)
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const techTags = formData.techTagsString
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    const metricsObj: Record<string, string> = {};
    formData.metrics.forEach(m => {
      if (m.key.trim()) metricsObj[m.key.trim()] = m.value.trim();
    });

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken() || "",
        },
        body: JSON.stringify({
          ...formData,
          techTags,
          techTagsString: undefined,
          metrics: metricsObj,
          liveUrl: formData.liveUrl || null,
          githubUrl: formData.githubUrl || null,
          gallery,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(data.error || "Failed to create project");
      }
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(11, 15, 26, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "0.75rem",
    color: "#F9FAFB",
    fontSize: "0.9rem",
    outline: "none",
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <Link href="/admin/projects" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              ← Back to Projects
            </Link>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
            New <span className="gradient-text">Project</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.875rem" }}>
            Fill in the details below to add a new project to your portfolio.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {error && <span style={{ color: "#EF4444", fontSize: "0.875rem", fontWeight: 600 }}>{error}</span>}
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="btn btn-primary" 
            style={{ borderRadius: "100px", padding: "0.75rem 2.5rem", opacity: loading ? 0.7 : 1, fontSize: "0.9rem", fontWeight: 700 }}
          >
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "2rem" }}>
        
        {/* Main Content Pane */}
        <div style={{ display: "grid", gap: "2rem" }}>
          <GlassCard className="p-8">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#3B82F6" }}>📸 Images</h2>
            <ImageUpload 
              label="Cover Image" 
              value={formData.featuredUrl} 
              onChange={(url) => setFormData({ ...formData, featuredUrl: url })} 
            />
            
            <div style={{ marginTop: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#94A3B8", marginBottom: "1rem" }}>
                Gallery Photos
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem" }}>
                {gallery.map((url, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1" }}>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button 
                      type="button" 
                      onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                      style={{ position: "absolute", top: "5px", right: "5px", background: "#EF4444", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "10px" }}
                    >✕</button>
                  </div>
                ))}
                <ImageUpload 
                  label="" 
                  onChange={(url) => setGallery([...gallery, url])} 
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#3B82F6" }}>📝 About the Project</h2>
            
            <FormLabel label="Project Name *">
              <input required style={inputStyle} placeholder="e.g. My Awesome App" value={formData.title} onChange={e => handleTitleChange(e.target.value)} />
            </FormLabel>

            <FormLabel label="Short Description *" hint="One sentence about what this project does">
              <input required style={inputStyle} placeholder="e.g. A real-time chat app built with Next.js" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
            </FormLabel>

            <FormLabel label="Full Description *" hint="Write a detailed description. You can use Markdown formatting.">
              <textarea required style={{ ...inputStyle, minHeight: "300px", fontFamily: "monospace" }} placeholder="Describe the project, challenges, and what you learned..." value={formData.contentMDX} onChange={e => setFormData({ ...formData, contentMDX: e.target.value })} />
            </FormLabel>
          </GlassCard>
        </div>

        {/* Settings Pane */}
        <div style={{ display: "grid", gap: "2rem", height: "fit-content" }}>

          {/* Links */}
          <GlassCard className="p-8">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#10B981" }}>🔗 Links</h2>

            <FormLabel label="Live Demo URL" hint="Where people can try the project">
              <input style={inputStyle} placeholder="https://myproject.vercel.app" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} />
            </FormLabel>

            <FormLabel label="GitHub Repository" hint="Link to the source code">
              <input style={inputStyle} placeholder="https://github.com/username/repo" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
            </FormLabel>
          </GlassCard>

          {/* Settings */}
          <GlassCard className="p-8">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#64748B" }}>⚙️ Settings</h2>
            
            <FormLabel label="URL Slug" hint="Auto-generated from the name. Change only if needed.">
              <input 
                style={inputStyle} 
                placeholder="my-awesome-app"
                value={formData.slug} 
                onChange={e => {
                  setFormData({ ...formData, slug: e.target.value });
                  setIsSlugManual(true);
                }} 
              />
            </FormLabel>

            <FormLabel label="Technologies Used" hint="Separate with commas: React, Next.js, Prisma">
              <input style={inputStyle} placeholder="React, TypeScript, Prisma" value={formData.techTagsString} onChange={e => setFormData({ ...formData, techTagsString: e.target.value })} />
            </FormLabel>

            <FormLabel label="Display Order" hint="Lower number = shown first">
              <input type="number" style={inputStyle} value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
            </FormLabel>

            <div style={{ marginTop: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#94A3B8" }}>Stats & Numbers</label>
                <button type="button" onClick={addMetric} style={{ background: "none", border: "none", color: "#3B82F6", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}>+ Add</button>
              </div>
              {formData.metrics.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input placeholder="e.g. Users" style={{ ...inputStyle, flex: 1, padding: "0.5rem" }} value={m.key} onChange={e => updateMetric(i, "key", e.target.value)} />
                  <input placeholder="e.g. 10k+" style={{ ...inputStyle, flex: 1, padding: "0.5rem" }} value={m.value} onChange={e => updateMetric(i, "value", e.target.value)} />
                  <button type="button" onClick={() => removeMetric(i)} style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "2rem", padding: "1rem", background: "rgba(16, 185, 129, 0.05)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
              <input type="checkbox" id="published" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} style={{ width: "18px", height: "18px" }} />
              <label htmlFor="published" style={{ fontSize: "0.875rem", color: "#10B981", fontWeight: 600, cursor: "pointer" }}>Publish this project</label>
            </div>
          </GlassCard>
        </div>

      </form>
    </div>
  );
}
