"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme"
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        color: "var(--color-text-primary)",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--ease-out-expo)",
        position: "relative",
        overflow: "hidden",
      }}
      className="theme-toggle hover:scale-105"
    >
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 0 : 30,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ position: "absolute" }}
      >
        <Moon size={18} strokeWidth={2} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: isDark ? -30 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ position: "absolute" }}
      >
        <Sun size={18} strokeWidth={2} />
      </motion.div>
    </button>
  );
}
