"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { getCsrfToken } from "@/lib/csrf-client";

interface Project {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  updatedAt: string;
  techTags: string[];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, published: boolean) {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken() || "",
        },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        setAlert({ type: "success", message: `Project ${published ? "drafted" : "published"} successfully.` });
        fetchProjects();
      } else {
        setAlert({ type: "error", message: "Action failed. Please try again." });
      }
    } catch (err) {
      console.error("Failed to toggle publish:", err);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { 
        method: "DELETE",
        headers: {
          "x-csrf-token": getCsrfToken() || "",
        }
      });
      if (res.ok) {
        setAlert({ type: "success", message: "Project deleted successfully." });
        fetchProjects();
      } else {
        setAlert({ type: "error", message: "Delete failed. Permission or security error." });
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }

  return (
    <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-end", 
        marginBottom: "3rem",
        position: "relative"
      }}>
        {alert && (
          <div style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            background: alert.type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "100px",
            fontSize: "0.875rem",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 100,
            backdropFilter: "blur(10px)",
            animation: "fadeInDown 0.3s ease-out"
          }}>
            {alert.type === "success" ? "✓" : "⚠"} {alert.message}
          </div>
        )}
        <div>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 700, 
            fontFamily: "var(--font-display)",
            marginBottom: "0.5rem"
          }}>
            Project <span className="gradient-text">Library</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "1rem" }}>
            Manage and showcase your best professional work.
          </p>
        </div>
        
        <Link href="/admin/projects/new" className="btn btn-primary" style={{ 
          borderRadius: "100px", 
          padding: "0.75rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.9rem",
          fontWeight: 600
        }}>
          <span>+</span> Create New Project
        </Link>
      </header>

      {loading ? (
        <div style={{ color: "#94A3B8", textAlign: "center", padding: "4rem" }}>
          <div className="spinner" style={{ marginBottom: "1rem" }}></div>
          Loading projects...
        </div>
      ) : (
        <GlassCard className="overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", background: "rgba(255, 255, 255, 0.02)" }}>
                <th style={{ padding: "1.25rem 1.5rem", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Title</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Tech Stack</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Status</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Last Modified</th>
                <th style={{ padding: "1.25rem 1.5rem", color: "#64748B", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr 
                  key={project.id} 
                  style={{ 
                    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ fontWeight: 600, color: "#F9FAFB", marginBottom: "0.25rem" }}>{project.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>/{project.slug}</div>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {project.techTags.slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "4px", background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
                          {tag}
                        </span>
                      ))}
                      {project.techTags.length > 3 && <span style={{ fontSize: "0.65rem", color: "#64748B" }}>+{project.techTags.length - 3}</span>}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <span style={{ 
                      fontSize: "0.7rem", 
                      fontWeight: 700, 
                      padding: "0.3rem 0.75rem", 
                      borderRadius: "100px",
                      background: project.published ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: project.published ? "#10B981" : "#F59E0B"
                    }}>
                      {project.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", color: "#94A3B8", fontSize: "0.8rem" }}>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <Link 
                        href={`/admin/projects/${project.id}`} 
                        style={{ 
                          color: "#3B82F6", 
                          textDecoration: "none", 
                          fontSize: "0.75rem", 
                          fontWeight: 700,
                          padding: "0.4rem 0.8rem",
                          background: "rgba(59, 130, 246, 0.1)",
                          borderRadius: "6px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => togglePublish(project.id, project.published)}
                        style={{ 
                          background: "rgba(16, 185, 129, 0.1)", 
                          border: "none", 
                          cursor: "pointer", 
                          color: "#10B981", 
                          fontSize: "0.75rem", 
                          fontWeight: 700,
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {project.published ? "Unpublish" : "Publish"}
                      </button>
                      <button 
                        onClick={() => deleteProject(project.id)}
                        style={{ 
                          background: "rgba(239, 68, 68, 0.1)", 
                          border: "none", 
                          cursor: "pointer", 
                          color: "#EF4444", 
                          fontSize: "0.75rem", 
                          fontWeight: 700,
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "4rem", textAlign: "center", color: "#94A3B8" }}>
                    No projects found. Create your first masterpiece.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </GlassCard>
      )}

    </div>
  );
}
