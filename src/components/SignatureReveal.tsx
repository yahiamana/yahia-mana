"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SignatureReveal — Renders a "Crafted with precision." message
 * and plays an SVG stroke animation (signature) when scrolled to 80% 
 * of the page wrapper box.
 */
export default function SignatureReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!containerRef.current || !pathRef.current || !textRef.current) return;

      // Calculate path length for stroke animation
      const length = pathRef.current.getTotalLength();
      
      gsap.set(pathRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });

      gsap.set(textRef.current, {
        opacity: 0,
        y: 20,
      });

      // The timeline triggers at 80% depth of this specific container or document body.
      // Usually, placing this component near the footer will make it trigger properly.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      }).to(pathRef.current, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut",
      }, "-=0.2");
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "1.5rem",
        padding: "var(--space-4xl) 0"
      }}
    >
      <p 
        ref={textRef}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          color: "var(--color-text-secondary)",
          fontStyle: "italic",
        }}
      >
        Crafted with precision.
      </p>
      
      {/* A stylized SVG signature path */}
      <svg 
        width="150" 
        height="60" 
        viewBox="0 0 150 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d="M 10 40 C 20 20, 40 10, 50 30 C 60 50, 70 40, 80 20 C 90 0, 100 20, 110 30 C 130 50, 140 20, 145 10"
          stroke="var(--color-accent-warm)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
