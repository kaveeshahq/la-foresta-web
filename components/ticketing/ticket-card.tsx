"use client";

import { CalendarDays } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import {
  formatEventDate,
  formatEventTime,
} from "@/lib/formatters";

import type {
  Ticket,
  TicketStatus,
} from "@/types/ticket";

const statusStyles: Record<
  TicketStatus,
  string
> = {
  VALID:
    "border-electric/30 text-electric",
  USED: "border-white/20 text-white/55",
  CANCELLED:
    "border-destructive/30 text-destructive",
  REFUNDED:
    "border-amber-300/30 text-amber-200",
};

type TicketCardProps = {
  ticket: Ticket;
};

export function TicketCard({
  ticket,
}: TicketCardProps) {
  return (
    <article className="relative overflow-hidden border border-white/10 bg-card/40 p-6 print:border-black/20 print:bg-white print:text-black">
      <div className="absolute right-[-5rem] top-[-5rem] size-40 rounded-full bg-electric/5 blur-[70px] print:hidden" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric print:text-black">
              {ticket.ticketTypeName}
            </p>

            <p className="font-display mt-3 text-2xl tracking-[-0.04em]">
              {ticket.ticketNumber}
            </p>
          </div>

          <span
            className={`font-technical border px-3 py-2 text-[8px] uppercase tracking-[0.18em] ${statusStyles[ticket.status]}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5 print:border-black/15">
          <CalendarDays className="size-4 text-electric print:text-black" />

          <p className="text-sm text-muted-foreground print:text-black/70">
            {formatEventDate(
              ticket.eventStartsAt
            )}{" "}
            /{" "}
            {formatEventTime(
              ticket.eventStartsAt
            )}
          </p>
        </div>

        <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[auto_1fr] sm:items-center print:border-black/15">
          <div className="w-fit bg-white p-3">
            <QRCodeSVG
              value={ticket.qrToken}
              size={184}
              level="M"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#07100a"
              aria-label={`QR code for ticket ${ticket.ticketNumber}`}
            />
          </div>

          <div>
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground print:text-black/55">
              Entry code
            </p>

            <p className="mt-3 text-sm leading-6 text-muted-foreground print:text-black/70">
              Present this QR code at the
              entrance. Each ticket can be
              checked in once.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
