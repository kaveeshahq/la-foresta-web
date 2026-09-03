import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CheckoutClient } from "@/components/ticketing/checkout-client";

import {
  ApiError,
  getPublishedEventBySlug,
  getTicketTypes,
} from "@/lib/api/events";

type CheckoutPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CheckoutPage({
  params,
}: CheckoutPageProps) {
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

        <main className="min-h-screen bg-background pt-24 sm:pt-28">
          <CheckoutClient
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
