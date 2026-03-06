"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "fadeIn";
}

/**
 * SectionReveal — A reusable wrapper that uses GSAP + ScrollTrigger
 * to fade and slightly scale content as the user scrolls, simulating
 * a slow, "heavenly" ascension.
 */
export default function SectionReveal({ children, delay = 0, direction = "up" }: SectionRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register plugin (safe to do multiple times)
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const element = containerRef.current;
      if (!element) return;

      let yOffset = 0;
      if (direction === "up") yOffset = 40;
      else if (direction === "down") yOffset = -40;
      
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: yOffset,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8, 
          delay: delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%", 
            once: true, 
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, direction]);

  return (
    <div ref={containerRef} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}
