import { prisma } from "@/lib/prisma";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";

/**
 * Admin Dashboard — Shows site metrics and recent activity.
 * Redesigned with "Divine UI" aesthetics.
 */
export default async function AdminDashboardPage() {
  const [projectCount, publishedCount, mediaCount, messageCount, recentLogs] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.media.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { admin: { select: { email: true } } },
      }),
    ]);

  const stats = [
    { 
      label: "Total Projects", 
      value: projectCount, 
      icon: "📁", 
      color: "#3B82F6", 
      bg: "rgba(59, 130, 246, 0.1)" 
    },
    { 
      label: "Published", 
      value: publishedCount, 
      icon: "✨", 
      color: "#10B981", 
      bg: "rgba(16, 185, 129, 0.1)" 
    },
    { 
      label: "Media Library", 
      value: mediaCount, 
      icon: "🖼️", 
      color: "#F59E0B", 
      bg: "rgba(245, 158, 11, 0.1)" 
    },
    { 
      label: "Pending Inquiries", 
      value: messageCount, 
      icon: "✉️", 
      color: "#EC4899", 
      bg: "rgba(236, 72, 153, 0.1)" 
    },
  ];

  return (
    <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: 700, 
          fontFamily: "var(--font-display)",
          marginBottom: "0.5rem",
          letterSpacing: "-0.02em"
        }}>
          System <span className="gradient-text">Overview</span>
        </h1>
        <p style={{ color: "#94A3B8", fontSize: "1rem" }}>
          Welcome back. Here's what's happening with your portfolio.
        </p>
      </header>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.5rem",
        marginBottom: "3rem",
      }}>
        {stats.map((stat, i) => (
          <GlassCard 
            key={stat.label} 
            className="p-6" 
            style={{ 
              animationDelay: `${i * 0.1}s`,
              border: "1px solid rgba(255, 255, 255, 0.05)"
            }}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              marginBottom: "1.5rem"
            }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "12px", 
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                color: stat.color,
                boxShadow: `0 8px 16px -4px ${stat.bg}`
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600, background: "rgba(16, 185, 129, 0.1)", padding: "0.25rem 0.5rem", borderRadius: "100px" }}>
                Active
              </span>
            </div>
            
            <div style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "0.25rem", color: "#F9FAFB" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#94A3B8", fontWeight: 500 }}>
              {stat.label}
            </div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        {/* Recent Activity */}
        <GlassCard className="p-8" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>System Logs</h2>
            <Link href="/admin/audit-logs" style={{ color: "#3B82F6", fontSize: "0.75rem", textDecoration: "none", fontWeight: 600 }}>View All</Link>
          </div>
          
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {recentLogs.map((log) => (
              <div 
                key={log.id} 
                style={{ 
                  display: "flex", 
                  gap: "1rem", 
                  paddingBottom: "1.25rem", 
                  borderBottom: "1px solid rgba(255, 255, 255, 0.03)" 
                }}
              >
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  background: log.action.includes("create") ? "#10B981" : log.action.includes("delete") ? "#EF4444" : "#3B82F6",
                  marginTop: "0.4rem",
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", color: "#F9FAFB", marginBottom: "0.2rem" }}>
                    {log.action.replace(".", " ")}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                    by {log.admin.email} • {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#64748B" }}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p style={{ color: "#94A3B8", textAlign: "center", padding: "2rem" }}>No activity recorded.</p>
            )}
          </div>
        </GlassCard>

        {/* Quick Actions / Helpers */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <GlassCard className="p-6" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Quick Connect</h3>
            <p style={{ fontSize: "0.875rem", color: "#94A3B8", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Need to update your presence? Jump straight to creating a new project or updating site metadata.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/admin/projects/new" className="btn btn-primary" style={{ fontSize: "0.75rem", padding: "0.6rem 1.25rem", borderRadius: "8px" }}>New Project</Link>
              <Link href="/admin/settings" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "0.6rem 1.25rem", borderRadius: "8px" }}>Configure Site</Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6" style={{ border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Database Status</h3>
            <div style={{ background: "rgba(11, 15, 26, 0.5)", borderRadius: "8px", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Provider</span>
                <span style={{ fontSize: "0.75rem", color: "#F9FAFB", fontWeight: 600 }}>Neon PostgreSQL</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Region</span>
                <span style={{ fontSize: "0.75rem", color: "#F9FAFB", fontWeight: 600 }}>US East (N. Virginia)</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

    </div>
  );
}
