"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  centerContent?: boolean;
}

/**
 * GlassCard — Reusable glassmorphism container emphasizing the "floating panel" aesthetic.
 * Includes optional framer-motion hover elevations and glow effects.
 */
export default function GlassCard({ 
  children, 
  className = "", 
  hoverEffect = true, 
  centerContent = false,
  style, 
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      {...props}
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: "relative",
        borderRadius: "16px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(var(--glass-blur))",
        border: "1px solid var(--glass-border)",
        overflow: "hidden",
        ...style,
      }}
      className={`glass-card ${className}`}
    >
      {/* Premium border beam effect on hover */}
      {hoverEffect && (
        <motion.div
          style={{
            position: "absolute",
            inset: "-1px",
            borderRadius: "inherit",
            background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            zIndex: 0,
            opacity: 0,
          }}
          whileHover={hoverEffect ? { 
            opacity: 0.2,
            left: ["-100%", "100%"],
            transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
          } : {}}
        />
      )}
      
      {/* Dynamic glow overlay */}
      {hoverEffect && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, var(--color-accent) 0%, transparent 70%)",
            opacity: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
          whileHover={hoverEffect ? { opacity: 0.05 } : {}}
        />
      )}
      
      <div 
        style={{ 
          position: "relative", 
          zIndex: 1, 
          height: "100%",
          display: centerContent ? "flex" : "block",
          alignItems: centerContent ? "center" : "normal",
          justifyContent: centerContent ? "center" : "normal"
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
