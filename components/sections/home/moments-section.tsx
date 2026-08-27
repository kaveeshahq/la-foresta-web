"use client";

import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "@/lib/gsap";

type Moment = {
  src: string;
  alt: string;
  caption: string;
  className: string;
};

const moments: Moment[] = [
  {
    src: "/media/moments/moment-01.jpg",
    alt: "La Foresta crowd atmosphere",
    caption: "Collective energy",
    className:
      "md:col-span-7 aspect-[16/10]",
  },
  {
    src: "/media/moments/moment-02.jpg",
    alt: "La Foresta lighting detail",
    caption: "Light becomes architecture",
    className:
      "md:col-span-5 aspect-[4/5]",
  },
  {
    src: "/media/moments/moment-03.jpg",
    alt: "La Foresta artist performance",
    caption: "Sound in motion",
    className:
      "md:col-span-5 aspect-[4/5]",
  },
  {
    src: "/media/moments/moment-04.jpg",
    alt: "La Foresta immersive environment",
    caption: "Built around atmosphere",
    className:
      "md:col-span-7 aspect-[16/10]",
  },
  {
    src: "/media/moments/moment-05.jpg",
    alt: "La Foresta night experience",
    caption: "After dark",
    className:
      "md:col-span-12 aspect-[16/7]",
  },
];

export function MomentsSection() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const labelRef =
    useRef<HTMLParagraphElement>(null);

  const headingRef =
    useRef<HTMLHeadingElement>(null);

  const copyRef =
    useRef<HTMLParagraphElement>(null);

  const itemsRef =
    useRef<Array<HTMLDivElement | null>>([]);

  const imagesRef =
    useRef<Array<HTMLImageElement | null>>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * Section label
       */
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
            start: "top 80%",
          },

          immediateRender: false,
        }
      );

      /*
       * Heading
       */
      gsap.fromTo(
        headingRef.current,
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
            start: "top 70%",
          },

          immediateRender: false,
        }
      );

      /*
       * Supporting copy
       */
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
            start: "top 62%",
          },

          immediateRender: false,
        }
      );

      /*
       * Image cards reveal
       */
      itemsRef.current.forEach(
        (item, index) => {
          if (!item) return;

          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 80,
              clipPath:
                "inset(14% 0% 14% 0%)",
            },
            {
              opacity: 1,
              y: 0,
              clipPath:
                "inset(0% 0% 0% 0%)",
              duration: 1.15,
              ease: "power3.out",

              scrollTrigger: {
                trigger: item,
                start: "top 82%",
              },

              delay: index * 0.04,
              immediateRender: false,
            }
          );
        }
      );

      /*
       * Subtle image parallax
       */
      imagesRef.current.forEach(
        (image) => {
          if (!image) return;

          gsap.fromTo(
            image,
            {
              yPercent: -5,
              scale: 1.06,
            },
            {
              yPercent: 5,
              scale: 1.06,
              ease: "none",

              scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
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
      {/* Atmosphere */}
      <div className="pointer-events-none absolute left-[-12rem] top-[18%] size-[38rem] rounded-full bg-forest-light/8 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] size-[40rem] rounded-full bg-electric/5 blur-[170px]" />

      <div className="lf-container relative z-10">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <p
            ref={labelRef}
            className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric sm:text-xs"
          >
            04 / Moments
          </p>

          <p className="font-technical hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            Atmosphere / Movement / Memory
          </p>
        </div>

        <div className="mt-7 h-px bg-white/10" />

        {/* Editorial intro */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-[clamp(4rem,9vw,10rem)] font-medium leading-[0.8] tracking-[-0.07em]"
            >
              Built to
              <br />
              be felt.
            </h2>
          </div>

          <p
            ref={copyRef}
            className="max-w-md text-base leading-8 text-muted-foreground sm:text-lg"
          >
            Fleeting moments of light, sound and
            movement become part of something larger.
            Every La Foresta experience is designed to
            stay with you after the music ends.
          </p>
        </div>

        {/* Gallery */}
        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {moments.map(
            (
              moment,
              index
            ) => (
              <div
                key={moment.src}
                ref={(element) => {
                  itemsRef.current[index] =
                    element;
                }}
                className={`group relative overflow-hidden border border-white/10 bg-card ${moment.className}`}
              >
                <img
                  ref={(element) => {
                    imagesRef.current[index] =
                      element;
                  }}
                  src={moment.src}
                  alt={moment.alt}
                  className="absolute inset-[-6%] h-[112%] w-[112%] object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                />

                {/* cinematic overlays */}
                <div className="absolute inset-0 bg-black/15" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_30%,rgba(111,255,153,0.08),transparent_38%)]" />

                {/* index */}
                <div className="absolute left-5 top-5">
                  <span className="font-technical text-[9px] tracking-[0.2em] text-white/60">
                    0{index + 1}
                  </span>
                </div>

                {/* caption */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 md:p-6">
                  <p className="font-display max-w-xs text-xl tracking-[-0.035em] text-white md:text-2xl">
                    {moment.caption}
                  </p>

                  <span className="size-1.5 shrink-0 rounded-full bg-electric opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </div>
            )
          )}
        </div>

        {/* Closing marker */}
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            La Foresta / Sri Lanka
          </p>

          <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
            Keep the night alive
          </p>
        </div>
      </div>
    </section>
  );
}