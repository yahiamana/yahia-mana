"use client";

import { motion } from "framer-motion";

/**
 * LightBeamEffect — A subtle radial gradient light beam representing the "heavenly" light.
 * Optimized for performance by using standard radial gradients instead of heavy CSS blurs.
 */
export default function LightBeamEffect() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        height: "100vh", // Confine the light beam to the hero section
      }}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.95, 1.05, 0.95] }}
        transition={{
          duration: 16, // Slowed down slightly for creamier motion
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "800px",
          // Use multiple radial gradients with sharp drop-offs instead of blur()
          background: "radial-gradient(ellipse at top, var(--color-accent) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)",
          opacity: 0.5,
          transform: "translateY(-40%)",
          willChange: "transform, opacity",
        }}
        className="light-beam"
      />
    </div>
  );
}
