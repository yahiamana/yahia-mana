"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * CustomCursor - A premium interactive cursor that follows the mouse.
 * Includes a center dot and a trailing circle for a sophisticated feel.
 */
export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  // Use springs for smooth follower motion - "Liquid" settings
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    // Only enable on desktop/pointer devices
    const checkViewport = () => {
      setIsDesktop(window.matchMedia("(pointer: fine)").matches);
    };
    
    checkViewport();
    window.addEventListener("resize", checkViewport);

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        const { clientX, clientY } = e;
        
        // Main cursor (instant)
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
        
        // Follower (using springs via framer motion is better, but let's stick to refs for perf if needed)
        // Actually, let's use the motion values for the follower for that "lazy" feel
        mouseX.set(clientX);
        mouseY.set(clientY);
      }
    };

    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.scale = "1";
    };

    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.scale = "0";
    };

    // Global listeners
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    // Interaction states
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    
    const onHoverStart = () => {
      if (cursorRef.current) cursorRef.current.style.scale = "2.5";
      if (followerRef.current) followerRef.current.style.scale = "0.5";
    };

    const onHoverEnd = () => {
      if (cursorRef.current) cursorRef.current.style.scale = "1";
      if (followerRef.current) followerRef.current.style.scale = "1";
    };

    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", onHoverStart);
      el.addEventListener("mouseleave", onHoverEnd);
    });

    return () => {
      window.removeEventListener("resize", checkViewport);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      interactiveElements.forEach(el => {
        el.removeEventListener("mouseenter", onHoverStart);
        el.removeEventListener("mouseleave", onHoverEnd);
      });
    };
  }, [mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        ref={cursorRef} 
        className="custom-cursor" 
        style={{ scale: 0 }} 
      />
      
      {/* Follower Circle */}
      <motion.div
        ref={followerRef}
        className="custom-cursor-follower"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
