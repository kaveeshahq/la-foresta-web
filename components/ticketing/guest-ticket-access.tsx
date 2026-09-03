"use client";

import Link from "next/link";
import {
  AlertTriangle,
  LoaderCircle,
  TicketCheck,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { TicketCard } from "@/components/ticketing/ticket-card";
import { getGuestTickets } from "@/lib/api/tickets";

import type { Ticket } from "@/types/ticket";

type GuestTicketAccessProps = {
  accessToken: string | null;
};

type AccessState =
  | "loading"
  | "missing"
  | "error"
  | "ready";

export function GuestTicketAccess({
  accessToken,
}: GuestTicketAccessProps) {
  const [state, setState] =
    useState<AccessState>(() =>
      accessToken
        ? "loading"
        : "missing"
    );

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let active = true;

    const loadTickets = async () => {
      try {
        const result =
          await getGuestTickets(
            accessToken
          );

        if (!active) {
          return;
        }

        setTickets(result);
        setState("ready");
      } catch (caught) {
        if (!active) {
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to access these tickets."
        );

        setState("error");
      }
    };

    void loadTickets();

    return () => {
      active = false;
    };
  }, [accessToken]);

  if (state === "loading") {
    return (
      <section className="lf-container flex min-h-[70svh] items-center">
        <div>
          <LoaderCircle className="size-6 animate-spin text-electric" />

          <p className="font-technical mt-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Securing your tickets
          </p>
        </div>
      </section>
    );
  }

  if (
    state === "missing" ||
    state === "error"
  ) {
    return (
      <section className="lf-container py-[clamp(6rem,10vw,10rem)]">
        <AlertTriangle className="size-10 text-electric" />

        <p className="font-technical mt-8 text-[10px] uppercase tracking-[0.25em] text-electric">
          Ticket access
        </p>

        <h1 className="font-display mt-7 text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.07em]">
          Link unavailable
          <span className="text-electric">
            .
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
          {state === "missing"
            ? "This ticket link does not contain an access token. Use the complete secure link from your confirmation email."
            : error}
        </p>

        <Link
          href="/events"
          className="font-technical mt-10 inline-block text-[10px] uppercase tracking-[0.2em] text-electric"
        >
          Explore events
        </Link>
      </section>
    );
  }

  const firstTicket = tickets[0];

  return (
    <section className="relative overflow-hidden py-[clamp(6rem,10vw,10rem)]">
      <div className="pointer-events-none absolute left-1/2 top-[12%] size-[40rem] -translate-x-1/2 rounded-full bg-electric/8 blur-[180px] print:hidden" />

      <div className="lf-container relative z-10">
        <TicketCheck className="size-12 text-electric print:text-black" />

        <p className="font-technical mt-8 text-[10px] uppercase tracking-[0.28em] text-electric print:text-black">
          Secure guest access
        </p>

        <h1 className="font-display mt-6 max-w-5xl text-[clamp(4rem,11vw,9rem)] leading-[0.76] tracking-[-0.075em]">
          Your tickets
          <span className="text-electric print:text-black">
            .
          </span>
        </h1>

        {firstTicket && (
          <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground print:text-black/70 sm:text-lg">
            {firstTicket.eventTitle} — keep
            each QR code ready for entry.
          </p>
        )}

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-7 print:hidden">
          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="font-technical text-[10px] uppercase tracking-[0.2em] text-electric"
          >
            Print tickets
          </button>

          {firstTicket && (
            <Link
              href={`/events/${firstTicket.eventSlug}`}
              className="font-technical text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View event
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
