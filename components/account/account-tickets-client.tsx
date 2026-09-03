"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TicketCheck } from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { TicketCard } from "@/components/ticketing/ticket-card";
import {
  getRegisteredTickets,
  TicketApiError,
} from "@/lib/api/tickets";
import type { Ticket } from "@/types/ticket";

export function AccountTicketsClient() {
  const router = useRouter();
  const [tickets, setTickets] =
    useState<Ticket[] | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const result =
          await getRegisteredTickets();

        if (active) {
          setTickets(result);
        }
      } catch (caught) {
        if (!active) {
          return;
        }

        if (
          caught instanceof TicketApiError &&
          caught.status === 401
        ) {
          router.replace(
            "/login?next=/account/tickets"
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load tickets."
        );
      }
    };

    void loadTickets();

    return () => {
      active = false;
    };
  }, [router]);

  if (error) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm leading-7 text-destructive">
        {error}
      </div>
    );
  }

  if (tickets === null) {
    return (
      <div className="border border-white/10 bg-card/40 p-6">
        <span className="block size-2 animate-pulse rounded-full bg-electric" />
        <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Loading tickets
        </p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
        <TicketCheck className="size-8 text-electric" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          No registered tickets yet.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Complete a purchase while signed
          in and your issued tickets will
          appear here.
        </p>
        <Link
          href="/events"
          className="font-technical mt-8 inline-block text-[9px] uppercase tracking-[0.2em] text-electric"
        >
          Explore events
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
        <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
          {tickets.length}{" "}
          {tickets.length === 1
            ? "ticket"
            : "tickets"}
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground print:hidden"
        >
          Print
        </button>
      </div>

      <div className="grid gap-5">
        {tickets.map((ticket) => (
          <div key={ticket.ticketId}>
            <TicketCard ticket={ticket} />
            <Link
              href={`/account/orders/${ticket.orderId}`}
              className="font-technical mt-3 inline-block text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground print:hidden"
            >
              View order
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
