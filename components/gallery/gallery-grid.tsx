"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

type GalleryMoment = {
  src: string;
  alt: string;
  title: string;
  detail: string;
  className: string;
  sizes: string;
};

const moments: GalleryMoment[] = [
  {
    src: "/media/moments/moment-01.jpg",
    alt: "Crowd immersed in the La Foresta atmosphere",
    title: "Collective energy",
    detail: "Crowd / Night",
    className:
      "md:col-span-7 md:row-span-2 aspect-[4/3] md:aspect-auto",
    sizes:
      "(max-width: 768px) 100vw, 58vw",
  },
  {
    src: "/media/moments/moment-02.jpg",
    alt: "Lighting installation within La Foresta",
    title: "Light as architecture",
    detail: "Light / Space",
    className:
      "md:col-span-5 aspect-[4/5]",
    sizes:
      "(max-width: 768px) 100vw, 42vw",
  },
  {
    src: "/media/moments/moment-03.jpg",
    alt: "Electronic artist performing at La Foresta",
    title: "Sound in motion",
    detail: "Artist / Performance",
    className:
      "md:col-span-5 aspect-[4/5]",
    sizes:
      "(max-width: 768px) 100vw, 42vw",
  },
  {
    src: "/media/moments/moment-04.jpg",
    alt: "Immersive outdoor environment at La Foresta",
    title: "A world after dark",
    detail: "Environment / Night",
    className:
      "md:col-span-6 aspect-[16/10]",
    sizes:
      "(max-width: 768px) 100vw, 50vw",
  },
  {
    src: "/media/moments/moment-05.jpg",
    alt: "Late-night La Foresta experience",
    title: "The final hours",
    detail: "Memory / Afterglow",
    className:
      "md:col-span-6 aspect-[16/10]",
    sizes:
      "(max-width: 768px) 100vw, 50vw",
  },
];

export function GalleryGrid() {
  const reduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const close = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const previous = useCallback(() => {
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current - 1 + moments.length) %
          moments.length
    );
  }, []);

  const next = useCallback(() => {
    setSelectedIndex((current) =>
      current === null
        ? null
        : (current + 1) % moments.length
    );
  }, []);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (
      keyboardEvent: KeyboardEvent
    ) => {
      if (keyboardEvent.key === "Escape") {
        close();
      } else if (
        keyboardEvent.key === "ArrowLeft"
      ) {
        previous();
      } else if (
        keyboardEvent.key === "ArrowRight"
      ) {
        next();
      }
    };

    const previousOverflow =
      document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    close,
    next,
    previous,
    selectedIndex,
  ]);

  const selectedMoment =
    selectedIndex === null
      ? null
      : moments[selectedIndex];

  return (
    <>
      <div className="grid auto-rows-[minmax(15rem,28vw)] grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        {moments.map((moment, index) => (
          <motion.button
            key={moment.src}
            type="button"
            onClick={() =>
              setSelectedIndex(index)
            }
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 50,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.18,
            }}
            transition={{
              duration: reduceMotion
                ? 0
                : 0.75,
              delay: reduceMotion
                ? 0
                : index * 0.05,
            }}
            className={`group relative min-h-64 overflow-hidden border border-white/10 bg-card text-left ${moment.className}`}
            aria-label={`Open image: ${moment.title}`}
          >
            <Image
              src={moment.src}
              alt={moment.alt}
              fill
              sizes={moment.sizes}
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(111,255,153,0.1),transparent_36%)]" />

            <span className="font-technical absolute left-5 top-5 text-[8px] tracking-[0.2em] text-white/60">
              0{index + 1}
            </span>
            <Maximize2 className="absolute right-5 top-5 size-4 text-white/45 transition-colors group-hover:text-electric" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="font-technical text-[7px] uppercase tracking-[0.2em] text-electric">
                {moment.detail}
              </p>
              <h2 className="font-display mt-3 text-2xl tracking-[-0.04em] text-white sm:text-3xl">
                {moment.title}
              </h2>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedMoment &&
          selectedIndex !== null && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedMoment.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion
                  ? 0
                  : 0.25,
              }}
              onClick={close}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-8"
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 z-20 flex size-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-electric hover:text-electric sm:right-8 sm:top-8"
                aria-label="Close gallery image"
              >
                <X className="size-5" />
              </button>

              <button
                type="button"
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  previous();
                }}
                className="absolute bottom-5 left-4 z-20 flex size-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-electric hover:text-electric sm:bottom-auto sm:left-8 sm:top-1/2 sm:-translate-y-1/2"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>

              <motion.div
                key={selectedMoment.src}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        scale: 0.98,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: reduceMotion
                    ? 0
                    : 0.3,
                }}
                onClick={(clickEvent) =>
                  clickEvent.stopPropagation()
                }
                className="relative h-[72svh] w-full max-w-6xl overflow-hidden"
              >
                <Image
                  src={selectedMoment.src}
                  alt={selectedMoment.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              <div className="pointer-events-none absolute inset-x-4 bottom-5 flex items-end justify-center sm:inset-x-24 sm:bottom-8">
                <div className="text-center">
                  <p className="font-technical text-[7px] uppercase tracking-[0.2em] text-electric">
                    {selectedIndex + 1} / {moments.length}
                  </p>
                  <p className="font-display mt-2 text-xl tracking-[-0.03em] text-white sm:text-2xl">
                    {selectedMoment.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  next();
                }}
                className="absolute bottom-5 right-4 z-20 flex size-11 items-center justify-center border border-white/15 text-white transition-colors hover:border-electric hover:text-electric sm:bottom-auto sm:right-8 sm:top-1/2 sm:-translate-y-1/2"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}
