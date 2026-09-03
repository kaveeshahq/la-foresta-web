import Link from "next/link";
import {
  ArrowUpRight,
  Ticket,
} from "lucide-react";

import { formatMoney } from "@/lib/formatters";

import type { Event } from "@/types/events";
import type { TicketType } from "@/types/ticket-type";

type EventTicketsProps = {
  event: Event;
  ticketTypes: TicketType[];
};

export function EventTickets({
  event,
  ticketTypes,
}: EventTicketsProps) {
  const activeTicketTypes =
    ticketTypes.filter(
      (ticket) => ticket.active
    );

  return (
    <section className="relative overflow-hidden bg-background py-[clamp(7rem,12vw,12rem)]">
      <div className="pointer-events-none absolute bottom-[-16rem] left-[20%] size-[42rem] rounded-full bg-electric/5 blur-[180px]" />

      <div className="lf-container relative z-10">
        <div className="flex items-center justify-between">
          <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric sm:text-xs">
            02 / Tickets
          </p>

          <p className="font-technical hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            Secure your place
          </p>
        </div>

        <div className="mt-7 h-px bg-white/10" />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[clamp(3.8rem,7vw,8rem)] font-medium leading-[0.82] tracking-[-0.065em]">
              Choose your
              <br />
              entry.
            </h2>

            <p className="mt-8 max-w-sm text-base leading-8 text-muted-foreground">
              Select your ticket on the
              next step. Availability is
              subject to the current event
              sales window.
            </p>
          </div>

          <div className="border-t border-white/10">
            {activeTicketTypes.length >
            0 ? (
              activeTicketTypes.map(
                (ticketType) => (
                  <div
                    key={
                      ticketType.id
                    }
                    className="grid gap-6 border-b border-white/10 py-8 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="flex gap-5">
                      <span className="flex size-11 shrink-0 items-center justify-center border border-white/10">
                        <Ticket className="size-4 text-electric" />
                      </span>

                      <div>
                        <h3 className="font-display text-2xl tracking-[-0.04em] sm:text-3xl">
                          {
                            ticketType.name
                          }
                        </h3>

                        {ticketType.description && (
                          <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                            {
                              ticketType.description
                            }
                          </p>
                        )}

                        <p className="font-technical mt-4 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Max{" "}
                          {
                            ticketType.maxPerOrder
                          }{" "}
                          per order
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-display text-3xl tracking-[-0.04em]">
                        {formatMoney(
                          ticketType.price,
                          ticketType.currency
                        )}
                      </p>

                      <p className="font-technical mt-2 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                        Per ticket
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="border-b border-white/10 py-10">
                <p className="text-muted-foreground">
                  Ticket sales are not
                  currently available.
                </p>
              </div>
            )}

            {activeTicketTypes.length >
              0 && (
              <Link
                href={`/events/${event.slug}/tickets`}
                className="group mt-8 flex min-h-16 items-center justify-between bg-electric px-6 text-background transition-all hover:bg-electric/90"
              >
                <span className="font-technical text-[10px] uppercase tracking-[0.22em]">
                  Select Tickets
                </span>

                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}