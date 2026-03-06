"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * ProjectCard — Animated project card with hover micro-interactions.
 *
 * Uses Framer Motion for hover effects and GSAP ScrollTrigger (applied
 * by the parent ProjectGrid) for scroll reveal animations.
 */

interface ProjectCardProps {
  title: string;
  slug: string;
  summary: string;
  featuredUrl: string | null;
  techTags: string[];
}

export default function ProjectCard({
  title,
  slug,
  summary,
  featuredUrl,
  techTags,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        borderRadius: "24px",
        overflow: "hidden",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        cursor: "pointer",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(12px)",
      }}
    >
      <Link
        href={`/projects/${slug}`}
        style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Image area */}
        <div
          style={{
            height: "240px",
            background: featuredUrl
              ? `url(${featuredUrl}) center/cover`
              : "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-secondary) 100%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Zoom effect on parent hover is handled by CSS below or motion */}
          <motion.div 
            className="card-image-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(59, 130, 246, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
              transition: "opacity 0.4s ease"
            }}
          >
            <div 
              style={{ 
                background: "white", 
                color: "black", 
                padding: "0.75rem 1.5rem", 
                borderRadius: "100px", 
                fontWeight: 700,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transform: "translateY(10px)",
              }}
            >
              View Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33334L12.6667 8L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          {/* Bottom Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, var(--color-bg) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "var(--color-text-primary)",
                margin: 0
              }}
            >
              {title}
            </h3>
            <div style={{ color: "var(--color-accent)", opacity: 0.6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </div>
          </div>
          
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {summary}
          </p>

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "auto"
            }}
          >
            {techTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.7rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "100px",
                  background: "rgba(59, 130, 246, 0.05)",
                  color: "var(--color-accent)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover glow effect border */}
        <motion.div
          className="hover-border"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            border: "2px solid var(--color-accent)",
            pointerEvents: "none",
            boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.1), var(--shadow-glow)",
          }}
        />
      </Link>
    </motion.article>
  );
}
