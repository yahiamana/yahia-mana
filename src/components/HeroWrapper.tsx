"use client";

/**
 * HeroWrapper — High-performance static Aurora mesh.
 * Replaced heavy CSS blurs and mix-blend-modes with simple, hardware-accelerated CSS animations.
 */
export default function HeroWrapper() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: "var(--color-bg)",
      }}
      aria-hidden="true"
    >
      
      {/* Base Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, var(--glass-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--glass-border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      {/* Main Aurora Mesh Layer */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "120%",
          height: "120%",
          background: `
            radial-gradient(circle at 30% 20%, var(--aurora-1) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, var(--aurora-2) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, var(--aurora-3) 0%, transparent 50%)
          `,
          filter: "blur(100px)",
          opacity: 0.12,
          animation: "rotate 60s linear infinite",
          mixBlendMode: "screen",
        }}
      />

      {/* Floating Interactive-like Orbs */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
          width: "35vw",
          height: "35vw",
          background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(60px)",
          animation: "float-hero-1 20s ease-in-out infinite",
        }}
      />
      
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, var(--color-accent-secondary) 0%, transparent 70%)",
          opacity: 0.08,
          filter: "blur(80px)",
          animation: "float-hero-1 25s ease-in-out infinite reverse",
        }}
      />

      {/* Cinematic Vignette */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 0%, var(--color-bg) 90%)",
          opacity: 0.8,
          zIndex: 2,
        }}
      />
    </div>
  );
}
