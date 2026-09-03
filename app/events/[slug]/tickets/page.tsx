import Link from "next/link";
import {
  ArrowLeft,
} from "lucide-react";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TicketSelector } from "@/components/ticketing/ticket-selector";

import {
  ApiError,
  getPublishedEventBySlug,
  getTicketTypes,
} from "@/lib/api/events";

import {
  formatEventDate,
  formatEventTime,
} from "@/lib/formatters";

type TicketPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TicketPage({
  params,
}: TicketPageProps) {
  const { slug } =
    await params;

  const { event, ticketTypes } =
    await (async () => {
      try {
        const event =
          await getPublishedEventBySlug(
            slug
          );

        const ticketTypes =
          await getTicketTypes(
            event.id
          );

        return {
          event,
          ticketTypes,
        };
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 404
        ) {
          notFound();
        }

        throw error;
      }
    })();

  return (
    <>
        <SiteHeader />

        <main className="min-h-screen bg-background">
          {/* Header */}
          <section className="lf-grid relative overflow-hidden border-b border-white/10 pb-16 pt-32 sm:pb-20 sm:pt-40">
            <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] size-[36rem] rounded-full bg-electric/8 blur-[160px]" />

            <div className="lf-container relative z-10">
              <Link
                href={`/events/${event.slug}`}
                className="group flex w-fit items-center gap-3 font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />

                Back to event
              </Link>

              <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
                    Tickets /{" "}
                    {event.title}
                  </p>

                  <h1 className="font-display mt-6 text-[clamp(4rem,10vw,9rem)] font-semibold leading-[0.78] tracking-[-0.075em]">
                    Choose your
                    <br />
                    entry
                    <span className="text-electric">
                      .
                    </span>
                  </h1>
                </div>

                <div className="border-l border-white/10 pl-5 lg:min-w-[250px]">
                  <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                    Event
                  </p>

                  <p className="mt-3 font-display text-xl">
                    {event.title}
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatEventDate(
                      event.startsAt
                    )}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatEventTime(
                      event.startsAt
                    )}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.venueName ??
                      "Location TBA"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ticket selector */}
          <section className="relative py-[clamp(5rem,9vw,9rem)]">
            <div className="lf-container">
              <TicketSelector
                event={event}
                ticketTypes={
                  ticketTypes
                }
              />
            </div>
          </section>
        </main>

        <SiteFooter />
    </>
  );
}
