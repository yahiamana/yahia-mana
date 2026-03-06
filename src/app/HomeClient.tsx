"use client";

import { useEffect, useRef } from "react";
import ProjectCard from "@/components/ProjectCard";

/**
 * HomeClient — Client component for home page interactive elements.
 * Handles GSAP ScrollTrigger batch animations for the project grid.
 */

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredUrl: string | null;
  techTags: string[];
}

export default function HomeClient({ projects }: { projects: Project[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let cleanup: (() => void) | undefined;

    // Dynamic import for GSAP to avoid SSR issues
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const cards = grid.querySelectorAll(".project-card");

        // Set initial state
        gsap.set(cards, {
          opacity: 0,
          y: 60,
          scale: 0.95,
        });

        // Batch animation — cards animate in groups as they enter viewport
        ScrollTrigger.batch(cards, {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "power3.out",
            });
          },
          start: "top 85%",
        });

        cleanup = () => {
          ScrollTrigger.getAll().forEach((t) => t.kill());
        };
      });
    });

    return () => cleanup?.();
  }, [projects]);

  return (
    <div
      ref={gridRef}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {projects.map((project) => (
        <div key={project.id} className="project-card">
          <ProjectCard
            title={project.title}
            slug={project.slug}
            summary={project.summary}
            featuredUrl={project.featuredUrl}
            techTags={project.techTags}
          />
        </div>
      ))}
    </div>
  );
}
