"use client";

/**
 * TechStackMarquee - An infinite looping ticker showcasing the developer's core technologies.
 * Built with raw CSS keyframes to ensure buttery smooth 60FPS scrolling without heavy JavaScript.
 */
export default function TechStackMarquee() {
  const technologies = [
    "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS",
    "GSAP", "Framer Motion", "Three.js", "Lenis Scroll",
    "Node.js", "Prisma ORM", "PostgreSQL", "REST APIs",
    "Java", "C", "SQL", "HTML", "CSS",
    "Git", "GitHub", "Cloudinary", "Neon", "Vercel"
  ];

  // Double the array to ensure seamless infinite looping visually
  const items = [...technologies, ...technologies];

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "2rem 0",
        position: "relative",
        background: "var(--color-bg)",
        borderTop: "1px solid var(--glass-border)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      {/* 
        Add fading edges to the left/right of the marquee 
        so items appear and disappear smoothly.
      */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "15%",
          background: "linear-gradient(to right, var(--color-bg), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div 
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "15%",
          background: "linear-gradient(to left, var(--color-bg), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div
        className="marquee-track"
        style={{
          padding: "1rem 0",
        }}
      >
        {items.map((tech, i) => (
          <div
            key={`${tech}-${i}`}
            className="glass marquee-item"
            style={{
              padding: "0.85rem 2.5rem",
              borderRadius: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "1.125rem",
              color: "var(--color-text-primary)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--glass-border)",
              transition: "all 0.5s var(--ease-out-expo)",
              animation: "float-tech 6s ease-in-out infinite",
              background: "var(--glass-bg)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--glass-border)";
              e.currentTarget.style.background = "var(--glass-bg)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span style={{ 
              background: i % 2 === 0 ? "var(--color-accent)" : "var(--color-accent-secondary)",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              marginRight: "12px"
            }} />
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}
