"use client";

import { useState, useEffect } from "react";
import GlassCard from "@/components/GlassCard";
import { getCsrfToken } from "@/lib/csrf-client";
import FormLabel from "@/components/FormLabel";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken() || "",
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "#94A3B8" }}>Loading settings...</div>;

  const inputStyle = {
    width: "100%",
    background: "rgba(11, 15, 26, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "0.75rem",
    color: "#F9FAFB",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
            Site <span className="gradient-text">Configuration</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.875rem" }}>
            Manage your global identity and SEO metadata.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {status === "success" && <span style={{ color: "#10B981", fontSize: "0.875rem", fontWeight: 600 }}>✨ Settings Saved</span>}
          {status === "error" && <span style={{ color: "#EF4444", fontSize: "0.875rem", fontWeight: 600 }}>❌ Save Failed</span>}
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn btn-primary" 
            style={{ borderRadius: "8px", padding: "0.75rem 2rem", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Brand & Identity */}
        <GlassCard className="p-8" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#3B82F6" }}>Identity & Metadata</h2>
          
          <FormLabel label="Site Title">
            <input 
              style={inputStyle} 
              value={settings.siteTitle} 
              onChange={e => setSettings({ ...settings, siteTitle: e.target.value })} 
            />
          </FormLabel>

          <FormLabel label="Site Tagline">
            <input 
              style={inputStyle} 
              value={settings.siteTagline} 
              onChange={e => setSettings({ ...settings, siteTagline: e.target.value })} 
            />
          </FormLabel>

          <FormLabel label="Contact Email">
            <input 
              style={inputStyle} 
              value={settings.contactEmail} 
              onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} 
            />
          </FormLabel>
        </GlassCard>

        {/* Hero Section */}
        <GlassCard className="p-8" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#10B981" }}>Hero Content</h2>
          
          <FormLabel label="Hero Heading">
            <input 
              style={inputStyle} 
              value={settings.heroHeading} 
              onChange={e => setSettings({ ...settings, heroHeading: e.target.value })} 
            />
          </FormLabel>

          <FormLabel label="Hero Subheading">
            <textarea 
              style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} 
              value={settings.heroSubheading} 
              onChange={e => setSettings({ ...settings, heroSubheading: e.target.value })} 
            />
          </FormLabel>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <FormLabel label="CTA Text">
              <input 
                style={inputStyle} 
                value={settings.heroCta} 
                onChange={e => setSettings({ ...settings, heroCta: e.target.value })} 
              />
            </FormLabel>
            <FormLabel label="CTA Link">
              <input 
                style={inputStyle} 
                value={settings.heroCtaLink} 
                onChange={e => setSettings({ ...settings, heroCtaLink: e.target.value })} 
              />
            </FormLabel>
          </div>
        </GlassCard>

        {/* Social Presence */}
        <GlassCard className="p-8" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "#F59E0B" }}>Social Presence</h2>
          
          <FormLabel label="GitHub URL">
            <input 
              style={inputStyle} 
              value={settings.socialGithub} 
              onChange={e => setSettings({ ...settings, socialGithub: e.target.value })} 
            />
          </FormLabel>

          <FormLabel label="LinkedIn URL">
            <input 
              style={inputStyle} 
              value={settings.socialLinkedin} 
              onChange={e => setSettings({ ...settings, socialLinkedin: e.target.value })} 
            />
          </FormLabel>

          <FormLabel label="Twitter URL">
            <input 
              style={inputStyle} 
              value={settings.socialTwitter} 
              onChange={e => setSettings({ ...settings, socialTwitter: e.target.value })} 
            />
          </FormLabel>
        </GlassCard>

        {/* Tips & Info */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <GlassCard className="p-6" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#10B981", marginBottom: "0.5rem" }}>💡 PRO TIP</h3>
            <p style={{ fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.6 }}>
              Changes to Site Title and Tagline are reflected across all pages and Meta SEO tags automatically. Keep them concise for the best search engine visibility.
            </p>
          </GlassCard>
          
          <GlassCard className="p-6" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>System Health</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontSize: "0.8rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }}></span>
              Prisma Sync Active
            </div>
          </GlassCard>
        </div>

      </form>

    </div>
  );
}
