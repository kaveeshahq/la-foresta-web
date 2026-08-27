"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

type EclipseVisualProps = {
  videoSrc?: string;
  imageSrc?: string;
};

export function EclipseVisual({
  videoSrc,
  imageSrc,
}: EclipseVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(coreRef.current, {
        scale: 1.045,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(haloRef.current, {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex size-full items-center justify-center"
    >
      {/* Outer orbit */}
      <div
        ref={haloRef}
        className="absolute size-[92%] rounded-full border border-electric/10"
      >
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric shadow-[0_0_28px_var(--electric)]" />
      </div>

      {/* Orbit rings */}
      <div className="absolute size-[76%] rounded-full border border-electric/15" />

      <div className="absolute size-[60%] rounded-full border border-electric/20" />

      {/* Atmospheric glow */}
      <div className="absolute size-[78%] rounded-full bg-forest-light/10 blur-[90px]" />

      <div className="absolute size-[62%] rounded-full bg-electric/5 blur-[50px]" />

      {/* Eclipse core */}
      <div
        ref={coreRef}
        className="relative size-[52%]"
      >
        <div className="absolute inset-[-7%] rounded-full bg-electric/15 blur-3xl" />

        <div className="absolute inset-[-2px] rounded-full border border-electric/30" />

        <div className="relative size-full overflow-hidden rounded-full bg-black">
          {/* Video */}
          {videoSrc && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 size-full object-cover"
            >
              <source
                src={videoSrc}
                type="video/mp4"
              />
            </video>
          )}

          {/* Image fallback */}
          {!videoSrc && imageSrc && (
            <img
              src={imageSrc}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          )}

          {/* Keep core black if no media */}
          {!videoSrc && !imageSrc && (
            <div className="absolute inset-0 bg-black" />
          )}

          {/* Dark cinematic treatment */}
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-electric/10" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.08),transparent_30%)]" />

          {/* Inner vignette */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_70px_rgba(0,0,0,0.9)]" />
        </div>
      </div>

      {/* Forest silhouette */}
      <div className="absolute bottom-[12%] left-1/2 h-[28%] w-[130%] -translate-x-1/2 overflow-hidden opacity-75">
        <div className="absolute bottom-0 left-[3%] h-[55%] w-[12%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

        <div className="absolute bottom-0 left-[14%] h-[72%] w-[16%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

        <div className="absolute bottom-0 left-[30%] h-[46%] w-[13%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

        <div className="absolute bottom-0 left-[43%] h-[80%] w-[18%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

        <div className="absolute bottom-0 left-[60%] h-[60%] w-[14%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

        <div className="absolute bottom-0 left-[74%] h-[76%] w-[17%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

        <div className="absolute bottom-0 left-[88%] h-[48%] w-[11%] bg-black [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />
      </div>
    </div>
  );
}