"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "@/lib/gsap";

type Artist = {
  number: string;
  name: string;
  origin: string;
  image: string;
};

const artists: Artist[] = [
  {
    number: "01",
    name: "Artist One",
    origin: "International",
    image: "/media/artists/artist-01.jpg",
  },
  {
    number: "02",
    name: "Artist Two",
    origin: "International",
    image: "/media/artists/artist-02.jpg",
  },
  {
    number: "03",
    name: "Artist Three",
    origin: "Sri Lanka",
    image: "/media/artists/artist-03.jpg",
  },
  {
    number: "04",
    name: "Artist Four",
    origin: "Sri Lanka",
    image: "/media/artists/artist-04.jpg",
  },
];

export function ArtistLineupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const [activeArtist, setActiveArtist] =
    useState<Artist | null>(null);

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
            start: "top 78%",
          },

          immediateRender: false,
        }
      );

      /*
       * Main heading
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
       * Artist rows stagger
       */
      gsap.fromTo(
        rowsRef.current,
        {
          opacity: 0,
          y: 55,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
          },

          immediateRender: false,
        }
      );

      /*
       * Giant LINEUP background movement
       */
      gsap.fromTo(
        marqueeRef.current,
        {
          xPercent: 8,
        },
        {
          xPercent: -18,
          ease: "none",

          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /*
   * Cursor-following artist image
   */
  useEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;

    if (!section || !preview) return;

    const xTo = gsap.quickTo(preview, "x", {
      duration: 0.7,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(preview, "y", {
      duration: 0.7,
      ease: "power3.out",
    });

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      const bounds =
        section.getBoundingClientRect();

      const x =
        event.clientX - bounds.left;

      const y =
        event.clientY - bounds.top;

      xTo(x);
      yTo(y);
    };

    section.addEventListener(
      "pointermove",
      handlePointerMove
    );

    return () => {
      section.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  /*
   * Animate preview in/out
   */
  useEffect(() => {
    const preview = previewRef.current;

    if (!preview) return;

    if (activeArtist) {
      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(preview, {
        opacity: 0,
        scale: 0.88,
        duration: 0.25,
        ease: "power3.out",
      });
    }
  }, [activeArtist]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-[clamp(7rem,12vw,12rem)]"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-[8%] top-[20%] size-[34rem] rounded-full bg-forest-light/8 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-15rem] right-[-8rem] size-[40rem] rounded-full bg-electric/5 blur-[170px]" />

      {/* Giant background word */}
      <div className="pointer-events-none absolute left-0 top-[20%] w-[150%] overflow-hidden">
        <div
          ref={marqueeRef}
          className="font-display whitespace-nowrap text-[clamp(10rem,28vw,32rem)] font-semibold leading-none tracking-[-0.08em] text-white/[0.018]"
        >
          LINEUP LINEUP LINEUP
        </div>
      </div>

      <div className="lf-container relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p
            ref={labelRef}
            className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric sm:text-xs"
          >
            03 / Artists
          </p>

          <p className="font-technical hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            Eclipse / 2026
          </p>
        </div>

        <div className="mt-7 h-px bg-white/10" />

        {/* Heading */}
        <div className="mt-14 overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display max-w-6xl text-[clamp(4rem,9vw,10rem)] font-medium leading-[0.8] tracking-[-0.07em]"
          >
            Sound without
            <br />
            borders.
          </h2>
        </div>

        {/* Intro */}
        <div className="mt-10 flex justify-end">
          <p className="max-w-md text-base leading-8 text-muted-foreground">
            A carefully selected mix of international
            and local artists shaping the sound of the
            next La Foresta experience.
          </p>
        </div>

        {/* Artist list */}
        <div className="mt-20 border-t border-white/10">
          {artists.map((artist, index) => (
            <div
              key={artist.number}
              ref={(element) => {
                rowsRef.current[index] = element;
              }}
              onMouseEnter={() =>
                setActiveArtist(artist)
              }
              onMouseLeave={() =>
                setActiveArtist(null)
              }
              className="
                group
                relative
                grid
                cursor-default
                grid-cols-[50px_1fr]
                items-center
                gap-4
                border-b
                border-white/10
                py-7
                transition-colors
                duration-300
                md:grid-cols-[80px_1fr_180px]
                md:py-9
              "
            >
              {/* Number */}
              <span className="font-technical text-[9px] text-electric">
                {artist.number}
              </span>

              {/* Artist */}
              <h3
                className="
                  font-display
                  text-[clamp(2.2rem,5vw,5.7rem)]
                  font-medium
                  leading-none
                  tracking-[-0.055em]
                  text-foreground
                  transition-all
                  duration-500
                  group-hover:translate-x-3
                  group-hover:text-electric
                "
              >
                {artist.name}
              </h3>

              {/* Origin */}
              <p className="font-technical hidden text-right text-[9px] uppercase tracking-[0.18em] text-muted-foreground md:block">
                {artist.origin}
              </p>

              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 bg-electric/[0.025] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Bottom detail */}
        <div className="mt-8 flex items-center justify-between">
          <p className="font-technical text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Full lineup coming soon
          </p>

          <span className="font-technical text-[9px] uppercase tracking-[0.18em] text-electric">
            04 Artists
          </span>
        </div>
      </div>

      {/*
       * Cursor artist preview.
       *
       * Desktop only because hover-following images
       * don't make sense on touch devices.
       */}
      <div
        ref={previewRef}
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-20
          hidden
          aspect-[4/5]
          w-[240px]
          -translate-x-1/2
          -translate-y-1/2
          overflow-hidden
          border
          border-white/10
          bg-black
          opacity-0
          lg:block
          xl:w-[280px]
        "
      >
        {activeArtist && (
          <>
            <img
              key={activeArtist.image}
              src={activeArtist.image}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />

            {/* Treatment */}
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-electric/10" />

            <div className="absolute inset-0 mix-blend-color bg-forest-light/10" />

            {/* Artist information */}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-technical text-[8px] uppercase tracking-[0.2em] text-electric">
                {activeArtist.number}
              </p>

              <p className="font-display mt-2 text-2xl tracking-[-0.04em] text-white">
                {activeArtist.name}
              </p>

              <p className="font-technical mt-2 text-[8px] uppercase tracking-[0.18em] text-white/50">
                {activeArtist.origin}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}