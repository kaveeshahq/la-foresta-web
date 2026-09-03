"use client";

import Link from "next/link";

import {
  Check,
  TicketCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  formatEventDate,
  formatEventTime,
} from "@/lib/formatters";

import { TicketCard } from "@/components/ticketing/ticket-card";

import type { Ticket } from "@/types/ticket";

const TICKETS_KEY =
  "laforesta-guest-tickets";

const SELECTION_KEY =
  "laforesta-ticket-selection";

const RESERVATION_KEY =
  "laforesta-reservation";

const COMPLETED_CHECKOUT_KEYS = [
  "laforesta-checkout-progress-v1",
  "laforesta-guest-order",
  "laforesta-payment",
  "laforesta-guest-access-token",
];

export function GuestTicketSuccess({
  eventSlug,
}: {
  eventSlug: string;
}) {
  const [
    tickets,
    setTickets,
  ] =
    useState<Ticket[] | null>(
      null
    );

  useEffect(() => {
    const stored =
      sessionStorage.getItem(
        TICKETS_KEY
      );

    const timeoutId =
      window.setTimeout(() => {
        if (!stored) {
          setTickets([]);
          return;
        }

        try {
          const parsed =
            JSON.parse(
              stored
            ) as Ticket[];

          setTickets(parsed);

          /*
           * Purchase completed.
           * Old selection/reservation data is
           * no longer needed.
           */
          sessionStorage.removeItem(
            SELECTION_KEY
          );

          sessionStorage.removeItem(
            RESERVATION_KEY
          );

          COMPLETED_CHECKOUT_KEYS.forEach(
            (key) =>
              sessionStorage.removeItem(
                key
              )
          );
        } catch {
          setTickets([]);
        }
      }, 0);

    return () =>
      window.clearTimeout(
        timeoutId
      );
  }, []);

  if (tickets === null) {
    return (
      <section className="lf-container flex min-h-[70svh] items-center">
        <div>
          <span className="block size-2 animate-pulse rounded-full bg-electric" />

          <p className="font-technical mt-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Loading tickets
          </p>
        </div>
      </section>
    );
  }

  if (tickets.length === 0) {
    return (
      <section className="lf-container py-[clamp(6rem,10vw,10rem)]">
        <p className="font-technical text-[10px] uppercase tracking-[0.25em] text-electric">
          Purchase
        </p>

        <h1 className="font-display mt-7 text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.07em]">
          Tickets not
          <br />
          available here.
        </h1>

        <p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground">
          This page requires the
          guest purchase session from
          the checkout flow. Your
          confirmation email also
          contains secure access to
          your tickets.
        </p>

        <Link
          href={`/events/${eventSlug}`}
          className="font-technical mt-10 inline-block text-[10px] uppercase tracking-[0.2em] text-electric"
        >
          Back to event
        </Link>
      </section>
    );
  }

  const firstTicket =
    tickets[0];

  return (
    <section className="relative overflow-hidden py-[clamp(6rem,10vw,10rem)]">
      <div className="pointer-events-none absolute left-1/2 top-[15%] size-[40rem] -translate-x-1/2 rounded-full bg-electric/8 blur-[180px]" />

      <div className="lf-container relative z-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-electric text-background">
          <Check className="size-6" />
        </div>

        <p className="font-technical mt-8 text-[10px] uppercase tracking-[0.28em] text-electric">
          Payment successful
        </p>

        <h1 className="font-display mt-6 max-w-5xl text-[clamp(4rem,11vw,10rem)] leading-[0.76] tracking-[-0.075em]">
          You&apos;re
          <br />
          in the forest
          <span className="text-electric">
            .
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
          Your payment was successful
          and your tickets have been
          issued. Registered purchases
          are also available from My
          Tickets, while guest purchases
          receive a secure email link.
        </p>

        <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
              Event
            </p>

            <p className="font-display mt-3 text-2xl tracking-[-0.04em]">
              {
                firstTicket.eventTitle
              }
            </p>
          </div>

          <div>
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
              Date
            </p>

            <p className="font-display mt-3 text-xl">
              {formatEventDate(
                firstTicket.eventStartsAt
              )}
            </p>
          </div>

          <div>
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
              Time
            </p>

            <p className="font-display mt-3 text-xl">
              {formatEventTime(
                firstTicket.eventStartsAt
              )}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="font-technical text-[10px] uppercase tracking-[0.25em] text-electric">
                Your tickets
              </p>

              <h2 className="font-display mt-4 text-4xl tracking-[-0.05em] sm:text-5xl">
                {tickets.length}{" "}
                {tickets.length === 1
                  ? "ticket"
                  : "tickets"}
              </h2>
            </div>

            <TicketCheck className="hidden size-8 text-electric sm:block" />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {tickets.map(
              (ticket) => (
                <TicketCard
                  key={
                    ticket.ticketId
                  }
                  ticket={ticket}
                />
              )
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <Link
            href={`/events/${eventSlug}`}
            className="font-technical text-[10px] uppercase tracking-[0.2em] text-electric"
          >
            Return to event
          </Link>

          <Link
            href="/account/tickets"
            className="font-technical ml-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            My Tickets
          </Link>
        </div>
      </div>
    </section>
  );
}
