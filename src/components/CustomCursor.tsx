"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/**
 * CustomCursor - Magnetic Aperture (V2)
 * Features an instant precision dot and a springy interactive aperture.
 * Solves the "slow" feeling by giving the user a direct feedback dot.
 */
export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Aperture (Ring) springs - Fast & Responsive
  const springConfig = { stiffness: 1000, damping: 50, mass: 0.3 };
  const ringX = useSpring(0, springConfig);
  const ringY = useSpring(0, springConfig);
  
  // Size and scale for snapping
  const apertureSize = useMotionValue(20);
  const apertureOpacity = useMotionValue(1);

  const updatePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    
    // Instant tracking for the dot
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    }

    // Spring tracking for the ring (only if not hovering/snapped)
    if (!isHovering) {
      ringX.set(clientX);
      ringY.set(clientY);
    }
  }, [isHovering, ringX, ringY]);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.matchMedia("(pointer: fine)").matches);
    };
    
    checkViewport();
    window.addEventListener("resize", checkViewport);
    window.addEventListener("mousemove", updatePosition);

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .interactive');
      
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setIsHovering(true);
        ringX.set(centerX);
        ringY.set(centerY);
        apertureSize.set(Math.max(rect.width, rect.height) + 15);
        apertureOpacity.set(0.3);
      } else {
        setIsHovering(false);
        apertureSize.set(20);
        apertureOpacity.set(1);
      }
    };

    window.addEventListener("mouseover", handleInteraction);

    return () => {
      window.removeEventListener("resize", checkViewport);
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleInteraction);
    };
  }, [ringX, ringY, apertureSize, apertureOpacity, updatePosition]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Precision Dot - Instant Transformation */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full z-[10000] pointer-events-none mix-blend-difference -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />

      {/* Magnetic Aperture - Spring Transformation */}
      <motion.div
        className="custom-cursor"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: apertureSize,
          height: apertureSize,
          opacity: apertureOpacity,
        }}
      />
    </>
  );
}
