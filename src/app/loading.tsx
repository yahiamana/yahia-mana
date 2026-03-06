"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "var(--color-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "1.5rem"
    }}>
      <div style={{ position: "relative" }}>
        {/* Animated logo/spinner */}
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 180, 360],
             opacity: [0.5, 1, 0.5]
           }}
           transition={{ 
             duration: 2, 
             repeat: Infinity, 
             ease: "easeInOut" 
           }}
           style={{
             width: "60px",
             height: "60px",
             border: "2px solid var(--color-accent)",
             borderRadius: "15px",
           }}
        />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30px",
          height: "30px",
          background: "var(--color-accent-secondary)",
          borderRadius: "50%",
          filter: "blur(10px)",
          opacity: 0.5
        }} />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase"
        }}
      >
        Synchronizing Experience
      </motion.p>
    </div>
  );
}
