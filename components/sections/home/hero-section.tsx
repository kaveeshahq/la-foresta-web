"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { ArrowDownRight } from "lucide-react";

import { EclipseVisual } from "@/components/visuals/eclipse-visual";
import { gsap } from "@/lib/gsap";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const visualScrollRef = useRef<HTMLDivElement>(null);
  const visualPointerRef = useRef<HTMLDivElement>(null);

  const metadataRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const scrollDotRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * Initial states
       */
      gsap.set(eyebrowRef.current, {
        opacity: 0,
        y: 16,
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        yPercent: 25,
      });

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 24,
      });

      gsap.set(visualScrollRef.current, {
        opacity: 0,
        scale: 0.82,
        y: 0,
      });

      gsap.set(metadataRef.current, {
        opacity: 0,
        x: 30,
      });

      gsap.set(footerRef.current, {
        opacity: 0,
        y: 18,
      });

      /*
       * Intro
       */
      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        })

        .to(
          titleRef.current,
          {
            opacity: 1,
            yPercent: 0,
            duration: 1.15,
          },
          "-=0.25"
        )

        .to(
          descriptionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.6"
        )

        .to(
          visualScrollRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
          },
          "-=0.9"
        )

        .to(
          metadataRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
          },
          "-=0.65"
        )

        .to(
          footerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45"
        );

      /*
       * Scroll indicator
       */
      gsap.to(scrollDotRef.current, {
        y: 8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /*
       * Eclipse / portal expansion.
       *
       * Instead of only drifting upward,
       * the visual now grows as the hero leaves.
       */
      gsap.fromTo(
        visualScrollRef.current,
        {
          y: 0,
          scale: 1,
        },
        {
          y: -40,
          scale: 1.72,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },

          immediateRender: false,
        }
      );

      /*
       * Hero title fades away as the portal expands.
       */
      gsap.fromTo(
        titleRef.current,
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
        },
        {
          yPercent: -16,
          opacity: 0.05,
          scale: 0.96,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "85% top",
            scrub: 1,
          },

          immediateRender: false,
        }
      );

      /*
       * Eyebrow fades slightly later.
       */
      gsap.fromTo(
        eyebrowRef.current,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: -30,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "15% top",
            end: "55% top",
            scrub: 1,
          },

          immediateRender: false,
        }
      );

      /*
       * Description leaves.
       */
      gsap.fromTo(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: -40,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "20% top",
            end: "60% top",
            scrub: 1,
          },

          immediateRender: false,
        }
      );

      /*
       * Event metadata leaves independently.
       */
      gsap.fromTo(
        metadataRef.current,
        {
          y: 0,
          opacity: 1,
        },
        {
          y: -70,
          opacity: 0,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "25% top",
            end: "65% top",
            scrub: 1,
          },

          immediateRender: false,
        }
      );

      /*
       * Bottom controls disappear near the handoff.
       */
      gsap.fromTo(
        footerRef.current,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: 25,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "40% top",
            end: "80% top",
            scrub: 1,
          },

          immediateRender: false,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /*
   * Pointer depth
   */
  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualPointerRef.current;

    if (!section || !visual) return;

    const xTo = gsap.quickTo(
      visual,
      "x",
      {
        duration: 1.1,
        ease: "power3.out",
      }
    );

    const yTo = gsap.quickTo(
      visual,
      "y",
      {
        duration: 1.1,
        ease: "power3.out",
      }
    );

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const bounds =
        section.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) /
          bounds.width -
        0.5;

      const y =
        (event.clientY - bounds.top) /
          bounds.height -
        0.5;

      xTo(x * 24);
      yTo(y * 18);
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    section.addEventListener(
      "pointermove",
      handlePointerMove
    );

    section.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      section.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      section.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="lf-noise lf-grid relative min-h-screen overflow-hidden"
    >
      {/* Main glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,color-mix(in_oklab,var(--forest-light)_18%,transparent),transparent_34%)]" />

      {/* Haze */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[48%] top-[10%] h-[28rem] w-[38rem] rounded-full bg-forest-light/5 blur-[140px]" />

        <div className="absolute bottom-[-8rem] right-[4%] h-[24rem] w-[32rem] rounded-full bg-electric/5 blur-[140px]" />
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/*
       * Static positioning wrapper.
       * GSAP does NOT touch this one.
       */}
      <div
        className="
          pointer-events-none
          absolute
          left-[68%]
          top-[48%]
          hidden
          size-[38rem]
          -translate-x-1/2
          -translate-y-1/2
          lg:block
          xl:size-[44rem]
        "
      >
        <div
          ref={visualScrollRef}
          className="size-full"
        >
          <div
            ref={visualPointerRef}
            className="size-full"
          >
            <EclipseVisual
              imageSrc="/media/hero/eclipse.jpg"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lf-container relative z-10 flex min-h-screen flex-col justify-end pb-8 pt-32 lg:pb-10">
        <div className="grid flex-1 items-center lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p
              ref={eyebrowRef}
              className="font-technical mb-7 text-[10px] uppercase tracking-[0.32em] text-electric sm:text-xs"
            >
              Colombo / Sri Lanka / Electronic Culture
            </p>

            <div className="overflow-hidden">
              <h1
                ref={titleRef}
                className="font-display max-w-5xl text-[clamp(4.8rem,12.2vw,12rem)] font-semibold leading-[0.73] tracking-[-0.075em]"
              >
                LA
                <br />
                FORESTA
              </h1>
            </div>

            <p
              ref={descriptionRef}
              className="mt-9 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              A meeting point between electronic sound,
              natural environments and collective human
              energy.
            </p>
          </div>

          <div className="relative hidden h-full lg:block">
            <div
              ref={metadataRef}
              className="absolute bottom-[18%] right-0 max-w-[260px]"
            >
              <p className="font-technical text-[10px] uppercase leading-6 tracking-[0.18em] text-muted-foreground">
                NEXT EXPERIENCE
              </p>

              <p className="mt-3 font-display text-3xl font-medium tracking-[-0.04em]">
                Eclipse
                <br />
                2026
              </p>

              <p className="mt-4 font-technical text-[10px] uppercase leading-5 tracking-[0.15em] text-muted-foreground">
                Port City Colombo
                <br />
                Sri Lanka
              </p>
            </div>
          </div>
        </div>

        <div
          ref={footerRef}
          className="flex items-end justify-between border-t border-white/10 pt-6"
        >
          <div className="flex items-center gap-3">
            <span className="font-technical text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Scroll to enter
            </span>

            <span
              ref={scrollDotRef}
              className="block size-1.5 rounded-full bg-electric"
            />
          </div>

          <Link
            href="/events"
            className="group flex items-center gap-4 font-technical text-[10px] uppercase tracking-[0.2em]"
          >
            Explore events

            <span className="flex size-11 items-center justify-center border border-white/15 transition-colors group-hover:border-electric group-hover:bg-electric group-hover:text-background">
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}