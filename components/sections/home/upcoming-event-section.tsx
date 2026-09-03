"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useLayoutEffect,
  useRef,
} from "react";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { gsap } from "@/lib/gsap";

export function UpcomingEventSection() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const labelRef =
    useRef<HTMLParagraphElement>(null);

  const titleRef =
    useRef<HTMLHeadingElement>(null);

  const mediaRef =
    useRef<HTMLDivElement>(null);

  const mediaInnerRef =
    useRef<HTMLDivElement>(null);

  const infoRef =
    useRef<HTMLDivElement>(null);

  const lineRef =
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
            titleRef.current,
            mediaRef.current,
            infoRef.current,
            lineRef.current,
          ],
          {
            opacity: 1,
            clearProps: "transform",
          }
        );

        return;
      }

      gsap.fromTo(
        labelRef.current,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
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
            start: "top 72%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 67%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        mediaRef.current,
        {
          opacity: 0,
          scale: 0.96,
          y: 70,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        infoRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 52%",
          },
          immediateRender: false,
        }
      );

      gsap.fromTo(
        mediaInnerRef.current,
        {
          yPercent: -4,
          scale: 1.08,
        },
        {
          yPercent: 4,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: mediaRef.current,
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
      className="relative overflow-hidden bg-background py-[clamp(7rem,12vw,12rem)]"
    >
      <div className="pointer-events-none absolute left-[-12rem] top-[15%] size-[34rem] rounded-full bg-forest-light/10 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-16rem] right-[-10rem] size-[40rem] rounded-full bg-electric/5 blur-[160px]" />

      <div className="lf-container relative z-10">
        <div className="flex items-center justify-between">
          <p
            ref={labelRef}
            className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric sm:text-xs"
          >
            02 / Upcoming Experience
          </p>

          <p className="font-technical hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            Colombo / 2026
          </p>
        </div>

        <div
          ref={lineRef}
          className="mt-7 h-px w-full bg-white/10"
        />

        <div className="mt-14 overflow-hidden">
          <h2
            ref={titleRef}
            className="font-display text-[clamp(4rem,13vw,11rem)] font-medium leading-[0.78] tracking-[-0.07em]"
          >
            Eclipse
            <span className="text-electric">
              .
            </span>
          </h2>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <div
            ref={mediaRef}
            className="group relative aspect-[4/5] overflow-hidden border border-white/10 bg-card lg:aspect-[1.25/1]"
          >
            <div
              ref={mediaInnerRef}
              className="absolute inset-[-6%]"
            >
              <Image
                src="/media/events/eclipse-2026.jpg"
                alt="La Foresta Eclipse 2026"
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
              />
            </div>

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(111,255,153,0.12),transparent_35%)]" />

            <div className="absolute left-5 top-5 flex items-center gap-3">
              <span className="size-2 rounded-full bg-electric shadow-[0_0_18px_var(--electric)]" />

              <span className="font-technical text-[9px] uppercase tracking-[0.22em] text-white/70">
                Next Experience
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8">
              <p className="font-technical text-[9px] uppercase tracking-[0.22em] text-white/60">
                La Foresta Presents
              </p>

              <p className="font-display mt-3 text-4xl font-medium tracking-[-0.05em] text-white md:text-6xl">
                Eclipse 2026
              </p>
            </div>
          </div>

          <div
            ref={infoRef}
            className="flex flex-col justify-between"
          >
            <div>
              <p className="max-w-md text-base leading-8 text-muted-foreground sm:text-lg">
                A night shaped by sound,
                shadow and movement. Eclipse
                brings La Foresta&apos;s
                world into the city through
                immersive production,
                electronic music and a space
                designed to evolve throughout
                the night.
              </p>

              <div className="mt-10 space-y-6 border-t border-white/10 pt-8">
                <div className="flex items-start gap-4">
                  <CalendarDays className="mt-1 size-4 shrink-0 text-electric" />

                  <div>
                    <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Date
                    </p>

                    <p className="mt-2 font-display text-xl tracking-[-0.03em]">
                      2026
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 size-4 shrink-0 text-electric" />

                  <div>
                    <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      Location
                    </p>

                    <p className="mt-2 font-display text-xl tracking-[-0.03em]">
                      Port City Colombo
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-7">
              <Link
                href="/events/la-foresta-eclipse-2026"
                className="group flex items-center justify-between"
              >
                <div>
                  <p className="font-technical text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                    Discover the experience
                  </p>

                  <p className="font-display mt-2 text-2xl tracking-[-0.04em]">
                    View Event
                  </p>
                </div>

                <span className="flex size-14 shrink-0 items-center justify-center border border-white/15 transition-all duration-300 group-hover:border-electric group-hover:bg-electric group-hover:text-background">
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>

              <Link
                href="/events/la-foresta-eclipse-2026/tickets"
                className="mt-4 flex h-14 items-center justify-center bg-electric px-5 text-center font-technical text-[10px] uppercase tracking-[0.22em] text-background transition-transform duration-300 hover:scale-[0.99]"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}