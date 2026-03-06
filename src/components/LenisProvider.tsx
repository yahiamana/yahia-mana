"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";

/**
 * LenisProvider — wraps the app with smooth scrolling via Lenis.
 *
 * Connects Lenis to GSAP ScrollTrigger using ScrollTrigger.scrollerProxy,
 * so GSAP scroll-driven animations work with Lenis' virtual scroll.
 *
 * Respects prefers-reduced-motion by disabling smooth scrolling.
 */

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType>({ lenis: null });

export function useLenis() {
  return useContext(LenisContext).lenis;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.8, // Reduced for a more responsive, snappier scroll
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      wheelMultiplier: 1.0, // Standardized for better control
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    // Import GSAP dynamically to avoid SSR issues
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Update ScrollTrigger on every Lenis scroll event
        lenis.on("scroll", ScrollTrigger.update);

        // Use Lenis requestAnimationFrame for ScrollTrigger's ticker
        gsap.ticker.add((time: number) => {
          lenis.raf(time * 1000);
        });

        // Disable GSAP's internal lag smoothing to let Lenis handle it
        gsap.ticker.lagSmoothing(0);
      });
    });

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}
