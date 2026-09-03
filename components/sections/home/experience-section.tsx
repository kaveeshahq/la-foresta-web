"use client";

import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "@/lib/gsap";

export function ExperienceSection() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const labelRef =
    useRef<HTMLParagraphElement>(null);

  const headingRef =
    useRef<HTMLHeadingElement>(null);

  const copyRef =
    useRef<HTMLDivElement>(null);

  const lineRef =
    useRef<HTMLDivElement>(null);

  const ambientRef =
    useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reducedMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      if (reducedMotion) {
        gsap.set(
          [
            labelRef.current,
            headingRef.current,
            copyRef.current,
            lineRef.current,
            ambientRef.current,
          ],
          {
            opacity: 1,
            clearProps: "transform",
          }
        );

        return;
      }

      gsap.fromTo(
        ambientRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1.15,
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "65% center",
            scrub: 1.2,
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        labelRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            toggleActions:
              "play none none reverse",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        headingRef.current,
        {
          opacity: 0,
          y: 120,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 69%",
            toggleActions:
              "play none none reverse",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        copyRef.current,
        {
          opacity: 0,
          y: 55,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
            toggleActions:
              "play none none reverse",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        lineRef.current,
        {
          scaleX: 0,
          transformOrigin:
            "left center",
        },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
          immediateRender: false,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-background py-[clamp(7rem,12vw,12rem)]"
    >
      <div
        ref={ambientRef}
        className="pointer-events-none absolute left-1/2 top-[-14rem] size-[36rem] -translate-x-1/2 rounded-full bg-forest-light/10 blur-[160px] sm:size-[52rem]"
      />

      <div className="lf-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="lf-container relative z-10">
        <div className="flex items-center justify-between">
          <p
            ref={labelRef}
            className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric sm:text-xs"
          >
            01 / The Experience
          </p>

          <p className="font-technical hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            Sound / Light / Space /
            Energy
          </p>
        </div>

        <div
          ref={lineRef}
          className="mt-7 h-px w-full bg-white/10"
        />

        <div className="mt-12 grid gap-12 sm:mt-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-16">
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-[clamp(3.6rem,12vw,10.5rem)] font-medium leading-[0.8] tracking-[-0.07em]"
            >
              More than
              <br />
              a night out.
            </h2>
          </div>

          <div
            ref={copyRef}
            className="max-w-md lg:pb-4"
          >
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              La Foresta brings together
              electronic sound, immersive
              environments and carefully
              curated spaces.
            </p>

            <p className="mt-7 text-base leading-8 text-muted-foreground sm:text-lg">
              Every event is designed as a
              journey — from the first
              arrival to the final track.
            </p>

            <div className="mt-10 border-l border-electric/30 pl-5 sm:mt-12">
              <p className="font-technical text-[9px] uppercase leading-6 tracking-[0.22em] text-foreground">
                We don&apos;t just host
                events.
                <br />
                We build environments.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-7 sm:mt-24 md:grid-cols-4">
          {[
            ["01", "Sound"],
            ["02", "Light"],
            ["03", "Space"],
            ["04", "Energy"],
          ].map(
            ([number, label]) => (
              <div key={number}>
                <span className="font-technical text-[9px] text-electric">
                  {number}
                </span>

                <p className="font-display mt-2 text-xl tracking-[-0.03em] text-foreground/80">
                  {label}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}