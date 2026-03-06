"use client";

/**
 * PlaygroundClient — Mini demos for showcasing skills.
 * (Three.js experiments have been removed for performance reasons)
 */

const experiments = [
  {
    title: "CSS Glow Effects",
    description: "Performant lightweight ambient glows without WebGL overhead.",
    component: (
      <div style={{ width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ 
          width: "100px", 
          height: "100px", 
          background: "var(--color-accent)", 
          borderRadius: "50%",
          filter: "blur(20px)",
          opacity: 0.7,
          animation: "pulse-playground 4s infinite alternate"
        }}>
        </div>
      </div>
    ),
  },
];

export default function PlaygroundClient() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "2rem",
      }}
    >
      {experiments.map((exp) => (
        <div
          key={exp.title}
          className="glass"
          style={{
            padding: "1.5rem",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {exp.component}
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginTop: "1rem" }}>
            {exp.title}
          </h3>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-secondary)",
              marginTop: "0.5rem",
            }}
          >
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
}
