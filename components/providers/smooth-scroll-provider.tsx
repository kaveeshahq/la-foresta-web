"use client";

import {
  type ReactNode,
  useEffect,
} from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    /*
     * Respect reduced motion.
     *
     * If the visitor has asked the OS/browser
     * to reduce motion, we don't initialize Lenis.
     */
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    /*
     * Whenever Lenis scrolls,
     * tell ScrollTrigger to recalculate.
     */
    lenis.on("scroll", ScrollTrigger.update);

    /*
     * GSAP owns the animation frame.
     *
     * This keeps Lenis and ScrollTrigger
     * on the exact same clock.
     */
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    /*
     * Disable GSAP lag smoothing here.
     * Helps avoid visible jumps in smooth-scroll
     * experiences after a temporary frame delay.
     */
    gsap.ticker.lagSmoothing(0);

    /*
     * Refresh after the page has settled.
     */
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      gsap.ticker.remove(update);

      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return children;
}