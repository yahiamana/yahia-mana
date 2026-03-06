"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

/**
 * Header — Sticky navigation with glassmorphism effect.
 *
 * Features:
 * - Transparent on hero, glass background on scroll
 * - Active link indicator with animated underline
 * - Mobile hamburger menu with slide-in panel
 * - Keyboard accessible
 */

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Playground", href: "/playground" },
];

export default function Header({ siteTitle = "Mana Yahia" }: { siteTitle?: string }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 var(--container-padding)",
        transition: "all var(--duration-normal) var(--ease-out-expo)",
        background: isScrolled ? "var(--glass-bg)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
      }}
    >
      <nav
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            textDecoration: "none",
            color: "var(--color-text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="gradient-text">{siteTitle}</span>
        </Link>

        {/* Desktop Nav */}
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  textDecoration: "none",
                  color:
                    pathname === link.href
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  transition: "color var(--duration-fast) ease",
                  position: "relative",
                  paddingBottom: "4px",
                }}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "var(--color-accent)",
                      borderRadius: "1px",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Theme Toggle + Mobile Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "12px",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-primary)",
                transition: "all 0.3s ease",
                width: "38px",
                height: "38px",
              }}
            >
              <motion.div
                key={theme}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </motion.div>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="mobile-menu-btn"
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "var(--color-text-primary)",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "280px",
          height: "100vh",
          background: "var(--glass-bg)",
          backdropFilter: "blur(32px)",
          borderLeft: "1px solid var(--glass-border)",
          padding: "5rem 2rem",
          zIndex: 90,
          display: isMobileMenuOpen ? "block" : "none",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {navLinks.map((link, i) => (
            <motion.li 
              key={link.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : 20 }}
              transition={{ delay: i * 0.05 + 0.2 }}
            >
              <Link
                href={link.href}
                style={{
                  display: "block",
                  padding: "1rem 0",
                  textDecoration: "none",
                  color: pathname === link.href ? "var(--color-accent)" : "var(--color-text-primary)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--glass-border)",
                  transition: "color 0.3s ease",
                }}
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Connect
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            {/* Social icons placeholder/shortcuts */}
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--color-border)" }} />
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--color-border)" }} />
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.2)",
            zIndex: 89,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
