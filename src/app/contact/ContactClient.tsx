"use client";

import { useState, type FormEvent } from "react";
import FormInput from "@/components/FormInput";
import Magnetic from "@/components/Magnetic";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";

/**
 * ContactClient — Client-side contact form with validation.
 */
export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <GlassCard
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🕊️</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
            Message Sent
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", lineHeight: 1.6 }}>
            Thank you for reaching out. I&apos;ll get back to you personally within 24 hours.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Magnetic>
              <button
                className="btn btn-primary"
                onClick={() => setStatus("idle")}
                style={{ borderRadius: "100px", padding: "1rem 3rem" }}
              >
                Send Another
              </button>
            </Magnetic>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <GlassCard style={{ padding: "3rem", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <form onSubmit={handleSubmit}>
          
          <FormInput id="name" label="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <FormInput id="email" label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <FormInput id="subject" label="Inquiry Type" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
          <FormInput id="message" label="How can I help you?" required isTextArea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />

          {status === "error" && (
            <p style={{ color: "var(--color-accent-warm)", fontSize: "0.875rem", marginBottom: "1.5rem", textAlign: "center", fontWeight: 500 }}>
              {errorMessage}
            </p>
          )}

          <Magnetic>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "sending"}
              style={{
                width: "100%",
                borderRadius: "100px",
                padding: "1.25rem",
                fontSize: "1rem",
                fontWeight: 700,
                opacity: status === "sending" ? 0.7 : 1,
                boxShadow: "var(--shadow-glow)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem"
              }}
            >
              {status === "sending" ? "Sending Journey..." : (
                <>
                  Transmit Message
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </>
              )}
            </button>
          </Magnetic>
        </form>
      </GlassCard>

      {/* Social Shortcut Grid */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "3rem" }}>
        {[
          { 
            platform: "Email", 
            icon: (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            ), 
            href: "mailto:mana.yahia@gmail.com",
            color: "#FFFFFF"
          },
          { 
            platform: "WhatsApp", 
            icon: (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            ), 
            href: "https://wa.me/213665478024",
            color: "#25D366"
          },
          { 
            platform: "Telegram", 
            icon: (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM5.934 11.66l12.72-4.908c.588-.23 1.103.116.945.892l-2.164 10.201c-.162.744-.606.927-1.23.576l-3.3-2.43-1.59 1.53c-.176.176-.324.324-.666.324l.236-3.344 6.088-5.498c.264-.235-.057-.365-.41-.131l-7.524 4.738-3.243-.101c-.705-.22-.72-.705.148-1.047z"/>
              </svg>
            ), 
            href: "https://t.me/yahiamana",
            color: "#0088cc"
          }
        ].map((item, idx) => (
          <Magnetic key={item.platform}>
            <a 
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ 
                textDecoration: "none", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "0.5rem" 
              }}
            >
              <GlassCard 
                centerContent
                style={{ 
                  width: "72px", 
                  height: "72px", 
                  borderRadius: "100px", 
                  color: hoveredIdx === idx ? item.color : "var(--color-text-secondary)",
                  //@ts-ignore - Dynamic brand glow
                  "--color-accent": item.color,
                  transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                  border: hoveredIdx === idx 
                    ? `1px solid ${item.color}33` 
                    : "1px solid rgba(255,255,255,0.05)",
                  background: hoveredIdx === idx 
                    ? `${item.color}11` 
                    : "rgba(255,255,255,0.01)"
                }}
                hoverEffect
              >
                {item.icon}
              </GlassCard>
              <span 
                style={{ 
                  fontSize: "0.85rem", 
                  color: hoveredIdx === idx ? item.color : "var(--color-text-secondary)", 
                  fontWeight: 600, 
                  transition: "color 0.3s ease",
                  opacity: hoveredIdx === idx ? 1 : 0.7
                }}
              >
                {item.platform}
              </span>
            </a>
          </Magnetic>
        ))}
      </div>
    </div>
  );
}
