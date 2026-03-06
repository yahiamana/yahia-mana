"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";

import Magnetic from "@/components/Magnetic";

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featuredUrl: string | null;
  techTags: string[];
}

export default function ProjectsClient({
  projects,
  allTags,
}: {
  projects: Project[];
  allTags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredProjects = activeTag
    ? projects.filter((p) => p.techTags.includes(activeTag))
    : projects;

  return (
    <>
      {/* Tag filter */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "var(--space-3xl)",
        }}
      >
        <Magnetic>
          <button
            className={`btn ${!activeTag ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTag(null)}
            style={{ fontSize: "0.875rem", padding: "0.75rem 1.75rem", borderRadius: "100px" }}
          >
            All
          </button>
        </Magnetic>
        {allTags.map((tag) => (
          <Magnetic key={tag}>
            <button
              className={`btn ${activeTag === tag ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTag(tag)}
              style={{ fontSize: "0.875rem", padding: "0.75rem 1.75rem", borderRadius: "100px" }}
            >
              {tag}
            </button>
          </Magnetic>
        ))}
      </div>

      {/* Projects grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            slug={project.slug}
            summary={project.summary}
            featuredUrl={project.featuredUrl}
            techTags={project.techTags}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            padding: "var(--space-3xl) 0",
          }}
        >
          No projects found with this filter.
        </p>
      )}
    </>
  );
}
