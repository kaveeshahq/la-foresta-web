import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import {
  formatEventDate,
  formatEventTime,
} from "@/lib/formatters";

import type { Event } from "@/types/events";

type EventHeroProps = {
  event: Event;
};

export function EventHero({
  event,
}: EventHeroProps) {
  return (
    <section className="lf-noise relative min-h-[100svh] overflow-hidden bg-background">
      {/* Artwork */}
      <div className="absolute inset-0">
        <Image
          src="/media/events/eclipse-2026.jpg"
          alt={event.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Treatment */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />

      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_38%,rgba(111,255,153,0.14),transparent_32%)]" />

      {/* Grid */}
      <div className="lf-grid pointer-events-none absolute inset-0 opacity-25" />

      {/* Content */}
      <div className="lf-container relative z-10 flex min-h-[100svh] flex-col justify-end pb-10 pt-32">
        <p className="font-technical text-[10px] uppercase tracking-[0.3em] text-electric sm:text-xs">
          La Foresta Presents
        </p>

        <h1 className="font-display mt-7 max-w-6xl text-[clamp(4.7rem,14vw,13rem)] font-semibold leading-[0.72] tracking-[-0.08em]">
          {event.title}
          <span className="text-electric">
            .
          </span>
        </h1>

        {event.shortDescription && (
          <p className="mt-8 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
            {event.shortDescription}
          </p>
        )}

        {/* Metadata */}
        <div className="mt-12 grid gap-6 border-t border-white/15 pt-7 sm:grid-cols-3 lg:max-w-4xl">
          <div className="flex gap-4">
            <CalendarDays className="mt-1 size-4 shrink-0 text-electric" />

            <div>
              <p className="font-technical text-[9px] uppercase tracking-[0.18em] text-white/45">
                Date
              </p>

              <p className="mt-2 font-display text-lg tracking-[-0.03em]">
                {formatEventDate(
                  event.startsAt
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock3 className="mt-1 size-4 shrink-0 text-electric" />

            <div>
              <p className="font-technical text-[9px] uppercase tracking-[0.18em] text-white/45">
                Starts
              </p>

              <p className="mt-2 font-display text-lg tracking-[-0.03em]">
                {formatEventTime(
                  event.startsAt
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin className="mt-1 size-4 shrink-0 text-electric" />

            <div>
              <p className="font-technical text-[9px] uppercase tracking-[0.18em] text-white/45">
                Location
              </p>

              <p className="mt-2 font-display text-lg tracking-[-0.03em]">
                {event.venueName ??
                  "Location TBA"}
              </p>

              <p className="mt-1 text-sm text-white/45">
                Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}