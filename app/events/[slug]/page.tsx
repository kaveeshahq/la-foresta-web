import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { EventHero } from "@/components/sections/events/event-hero";
import { EventStory } from "@/components/sections/events/event-story";
import { EventTickets } from "@/components/sections/events/event-tickets";

import {
  ApiError,
  getPublishedEventBySlug,
  getTicketTypes,
} from "@/lib/api/events";

type EventPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventPage({
  params,
}: EventPageProps) {
  const { slug } = await params;

  const { event, ticketTypes } =
    await (async () => {
      try {
    /*
     * 1. Resolve the event using its
     * public URL slug.
     */
    const event =
      await getPublishedEventBySlug(
        slug
      );

    /*
     * 2. Ticket types use the UUID,
     * not the event slug.
     */
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

        <main>
          <EventHero
            event={event}
          />

          <EventStory
            event={event}
          />

          <EventTickets
            event={event}
            ticketTypes={
              ticketTypes
            }
          />
        </main>

        <SiteFooter />
    </>
  );
}
