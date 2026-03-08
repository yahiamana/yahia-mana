"use client";

import Link from "next/link";
import SectionReveal from "./SectionReveal";
import GlassCard from "./GlassCard";
import Magnetic from "./Magnetic";

/**
 * HomeAboutSnippet - A short teaser section offering a warm introduction
 * right before plunging into the projects. Adds necessary visual density.
 */
export default function HomeAboutSnippet() {
  return (
    <section className="section" style={{ padding: "var(--space-4xl) var(--container-padding)" }}>
      <div className="container">
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", 
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center"
          }}
        >
          {/* Left Side: Visual/Profile Badge */}
          <SectionReveal direction="fadeIn" delay={0.2}>
            <div style={{ position: "relative" }}>
              <GlassCard className="p-2 overflow-hidden" style={{ borderRadius: "24px", perspective: "1000px" }}>
                <div 
                  className="profile-card-content"
                  style={{ 
                    minHeight: "450px", 
                    width: "100%", 
                    background: "linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-elevated))",
                    borderRadius: "18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "2.5rem 2rem",
                    gap: "1.5rem",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <div style={{ 
                    width: "120px", 
                    height: "120px", 
                    borderRadius: "50%", 
                    background: "var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    boxShadow: "var(--shadow-glow)",
                    marginBottom: "1rem"
                  }}>
                    MY
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>Mana Yahia</h3>
                  <p style={{ color: "var(--color-accent)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.8rem" }}>
                    Full-Stack Developer
                  </p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%", marginTop: "auto" }}>
                    <div className="glass p-4" style={{ borderRadius: "12px" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)" }}>6+</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Years Exp.</div>
                    </div>
                    <div className="glass p-4" style={{ borderRadius: "12px" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)" }}>50+</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Projects</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              {/* Decorative Floating Element */}
              <div 
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "100px",
                  height: "100px",
                  background: "radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)",
                  opacity: 0.2,
                  filter: "blur(20px)",
                  zIndex: -1
                }}
              />
            </div>
          </SectionReveal>

          {/* Right Side: Narrative */}
          <div>
            <SectionReveal direction="up" delay={0.4}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div className="flex h-[1px] w-12 bg-accent" style={{ background: "var(--color-accent)" }} />
                <span style={{ 
                  fontFamily: "var(--font-sans)", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.2em",
                  fontSize: "0.8rem",
                  color: "var(--color-accent)",
                  fontWeight: 700
                }}>
                  The Architect
                </span>
              </div>
              
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "2rem",
                color: "var(--color-text-primary)"
              }}>
                Engineering <span className="gradient-text">Human-Centric</span> Interfaces.
              </h2>
            </SectionReveal>

            <SectionReveal direction="up" delay={0.6}>
              <p style={{
                fontSize: "1.125rem",
                lineHeight: 1.8,
                color: "var(--color-text-secondary)",
                marginBottom: "2.5rem",
              }}>
                I am a 21-year-old Full-Stack Developer from Oran, Algeria, specializing in high-performance web experiences. My approach blends technical rigor with artistic intuition, ensuring every line of code serves a larger purpose: **delivering an unforgettable user journey.**
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <Magnetic strength={0.25}>
                  <Link href="/about" className="btn btn-secondary px-8 py-4 rounded-full border-accent/20">
                    Read Full Story
                  </Link>
                </Magnetic>
                
                <div style={{ borderLeft: "1px solid var(--glass-border)", paddingLeft: "1.5rem" }}>
                  <p dir="rtl" style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                    رسالة، شغف، وإبداع مستمر.
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-accent)", fontWeight: 600, marginTop: "0.25rem" }}>
                    Available for Freelance
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
