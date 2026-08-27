"use client";

import Link from "next/link";
import {
  useLayoutEffect,
  useRef,
} from "react";
import { ArrowUpRight } from "lucide-react";

import { gsap } from "@/lib/gsap";

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        labelRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 120,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 66%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        copyRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        buttonRef.current,
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
            start: "top 52%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        glowRef.current,
        {
          scale: 0.75,
          opacity: 0.25,
        },
        {
          scale: 1.3,
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-background py-[clamp(8rem,14vw,14rem)]"
    >
      {/* Background grid */}
      <div className="lf-grid pointer-events-none absolute inset-0 opacity-30" />

      {/* Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[180px]"
      />

      {/* Radial fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,var(--background)_78%)]" />

      <div className="lf-container relative z-10">
        <div className="flex flex-col items-center text-center">
          <p
            ref={labelRef}
            className="font-technical text-[10px] uppercase tracking-[0.3em] text-electric sm:text-xs"
          >
            The next experience awaits
          </p>

          <div className="mt-10 overflow-hidden">
            <h2
              ref={titleRef}
              className="font-display text-[clamp(4.5rem,12vw,13rem)] font-semibold leading-[0.73] tracking-[-0.08em]"
            >
              ENTER
              <br />
              THE FOREST
              <span className="text-electric">.</span>
            </h2>
          </div>

          <p
            ref={copyRef}
            className="mt-10 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg"
          >
            Step into a space built around sound,
            atmosphere and collective energy.
            Your next La Foresta experience starts here.
          </p>

          <Link
            ref={buttonRef}
            href="/events/la-foresta-eclipse-2026/tickets"
            className="
              group
              mt-12
              flex
              min-w-[250px]
              items-center
              justify-between
              gap-10
              border
              border-electric
              bg-electric
              px-6
              py-5
              text-background
              transition-all
              duration-300
              hover:bg-transparent
              hover:text-electric
            "
          >
            <span className="font-technical text-[10px] uppercase tracking-[0.22em]">
              Get Tickets
            </span>

            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

          <p className="font-technical mt-7 text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
            18+ / Colombo / Sri Lanka
          </p>
        </div>
      </div>
    </section>
  );
}