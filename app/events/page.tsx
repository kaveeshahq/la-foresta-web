import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublishedEvents } from "@/lib/api/events";
import {
  formatEventDate,
  formatEventTime,
} from "@/lib/formatters";

export default async function EventsPage() {
  const result =
    await getPublishedEvents()
      .then((events) => ({
        events,
        error: null,
      }))
      .catch((caught: unknown) => ({
        events: [],
        error:
          caught instanceof Error
            ? caught.message
            : "Unable to load events.",
      }));

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-background">
        <section className="lf-grid relative overflow-hidden border-b border-white/10 pb-16 pt-36 sm:pb-20 sm:pt-44">
          <div className="pointer-events-none absolute right-[-10rem] top-[-14rem] size-[38rem] rounded-full bg-electric/8 blur-[170px]" />

          <div className="lf-container relative z-10">
            <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
              La Foresta / Events
            </p>

            <h1 className="font-display mt-7 text-[clamp(4.5rem,13vw,12rem)] font-semibold leading-[0.75] tracking-[-0.075em]">
              Enter the
              <br />
              forest
              <span className="text-electric">
                .
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Immersive electronic music
              experiences shaped by place,
              sound and collective energy.
            </p>
          </div>
        </section>

        <section className="py-[clamp(5rem,9vw,9rem)]">
          <div className="lf-container">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <p className="font-technical text-[10px] uppercase tracking-[0.24em] text-electric">
                Published experiences
              </p>

              {!result.error && (
                <p className="font-technical text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {result.events.length}{" "}
                  {result.events.length === 1
                    ? "event"
                    : "events"}
                </p>
              )}
            </div>

            {result.error ? (
              <div className="border-b border-white/10 py-14">
                <h2 className="font-display text-3xl tracking-[-0.04em]">
                  Events are temporarily
                  unavailable.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                  {result.error}
                </p>
              </div>
            ) : result.events.length === 0 ? (
              <div className="border-b border-white/10 py-14">
                <h2 className="font-display text-3xl tracking-[-0.04em]">
                  The next experience is
                  taking shape.
                </h2>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Check back for newly
                  published events.
                </p>
              </div>
            ) : (
              <div>
                {result.events.map(
                  (event, index) => (
                    <article
                      key={event.id}
                      className="group grid gap-8 border-b border-white/10 py-10 sm:py-12 lg:grid-cols-[90px_1fr_auto] lg:items-center"
                    >
                      <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </p>

                      <div>
                        <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
                          {formatEventDate(
                            event.startsAt
                          )}
                        </p>

                        <h2 className="font-display mt-4 text-[clamp(2.8rem,6vw,6rem)] leading-[0.85] tracking-[-0.06em]">
                          {event.title}
                        </h2>

                        {event.shortDescription && (
                          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                            {
                              event.shortDescription
                            }
                          </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="size-4 text-electric" />
                            {formatEventTime(
                              event.startsAt
                            )}
                          </span>

                          <span className="flex items-center gap-2">
                            <MapPin className="size-4 text-electric" />
                            {event.venueName ??
                              "Location TBA"}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/events/${event.slug}`}
                        aria-label={`View ${event.title}`}
                        className="flex size-14 items-center justify-center border border-white/15 transition-all group-hover:border-electric group-hover:bg-electric group-hover:text-background"
                      >
                        <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
