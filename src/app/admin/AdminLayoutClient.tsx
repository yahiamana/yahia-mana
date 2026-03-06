"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getCsrfToken } from "@/lib/csrf-client";

/**
 * AdminLayoutClient — A premium, "Divine UI" admin shell.
 * Uses the cosmic navy palette and glassmorphism to feel professional yet creative.
 */

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Projects", href: "/admin/projects", icon: "📁" },
  { label: "Messages", href: "/admin/messages", icon: "💬" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: "📋" },
];

export default function AdminLayoutClient({
  user,
  children,
}: {
  user: { email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  async function handleLogout() {
    await fetch("/api/auth/logout", { 
      method: "POST",
      headers: { "x-csrf-token": getCsrfToken() || "" },
    });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: "#0B0F1A", // Deep Cosmic Navy
      color: "#F9FAFB",
      fontFamily: "var(--font-sans)"
    }}>
      {/* Sidebar */}
      <aside
        style={{
          width: isSidebarOpen ? "260px" : "80px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          padding: "2rem 0",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 50,
        }}
      >
        {/* Brand Logo */}
        <div style={{ padding: "0 1.5rem", marginBottom: "3rem", overflow: "hidden", whiteSpace: "nowrap" }}>
          <Link 
            href="/" 
            className="gradient-text" 
            style={{ 
              fontSize: "1.25rem", 
              fontWeight: 700, 
              textDecoration: "none",
              fontFamily: "var(--font-display)"
            }}
          >
            {isSidebarOpen ? "Mana Yahia" : "MY"}
          </Link>
          {isSidebarOpen && (
            <div style={{ fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.6)", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Admin Core
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              
              return (
                <li key={link.href} style={{ marginBottom: "0.5rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem 1.5rem",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      color: isActive ? "#F9FAFB" : "#94A3B8",
                      background: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
                      borderLeft: isActive ? "3px solid #3B82F6" : "3px solid transparent",
                      transition: "all 0.2s ease",
                      overflow: "hidden",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
                    {isSidebarOpen && <span>{link.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Stats/Profile Area */}
        <div style={{ 
          padding: "1rem 1.5rem", 
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          overflow: "hidden"
        }}>
          {isSidebarOpen && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#F9FAFB", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
              <div style={{ fontSize: "0.625rem", color: "#3B82F6", fontWeight: 700, textTransform: "uppercase", marginTop: "0.25rem" }}>
                {user.role}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#EF4444",
              padding: "0.6rem",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: isSidebarOpen ? "center" : "center",
              gap: "0.5rem"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
          >
            🚪 {isSidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "calc(100vw - 80px)" }}>
        {/* Top Header */}
        <header style={{ 
          height: "70px", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          background: "rgba(11, 15, 26, 0.5)",
          backdropFilter: "blur(10px)"
        }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "#94A3B8", 
              cursor: "pointer",
              fontSize: "1.25rem"
            }}
          >
            {isSidebarOpen ? "◁" : "▷"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#94A3B8" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></span>
              Database Connected
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main style={{ 
          flex: 1, 
          padding: "2.5rem", 
          overflowY: "auto",
          background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.03), transparent 40%)"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
