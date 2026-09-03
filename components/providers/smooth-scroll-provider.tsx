"use client";

import {
  type ReactNode,
  useEffect,
} from "react";
import Lenis from "lenis";

import {
  gsap,
  ScrollTrigger,
} from "@/lib/gsap";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on(
      "scroll",
      handleLenisScroll
    );

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    requestAnimationFrame(refresh);

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

    window.addEventListener(
      "load",
      refresh
    );

    return () => {
      window.removeEventListener(
        "load",
        refresh
      );

      gsap.ticker.remove(update);

      lenis.off(
        "scroll",
        handleLenisScroll
      );

      lenis.destroy();
    };
  }, []);

  return children;
}