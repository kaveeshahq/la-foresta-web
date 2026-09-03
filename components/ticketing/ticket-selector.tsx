"use client";

import {
  Minus,
  Plus,
  ArrowRight,
  Ticket,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { formatMoney } from "@/lib/formatters";
import { useRouter } from "next/navigation";
import type { Event } from "@/types/events";
import type { TicketType } from "@/types/ticket-type";

type TicketSelectorProps = {
  event: Event;
  ticketTypes: TicketType[];
};

type Quantities = Record<
  string,
  number
>;

function isTicketOnSale(
  ticketType: TicketType
) {
  if (!ticketType.active) {
    return false;
  }

  const now = Date.now();

  if (
    ticketType.salesStartAt &&
    now <
      new Date(
        ticketType.salesStartAt
      ).getTime()
  ) {
    return false;
  }

  if (
    ticketType.salesEndAt &&
    now >
      new Date(
        ticketType.salesEndAt
      ).getTime()
  ) {
    return false;
  }

  return true;
}

export function TicketSelector({
  event,
  ticketTypes,
}: TicketSelectorProps) {
  const [quantities, setQuantities] =
    useState<Quantities>({});

  const availableTicketTypes =
    ticketTypes.filter(
      isTicketOnSale
    );

  const selectedItems =
    useMemo(() => {
      return availableTicketTypes
        .map((ticketType) => ({
          ticketType,
          quantity:
            quantities[
              ticketType.id
            ] ?? 0,
        }))
        .filter(
          (item) =>
            item.quantity > 0
        );
    }, [
      availableTicketTypes,
      quantities,
    ]);

  const totalQuantity =
    useMemo(() => {
      return selectedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,
        0
      );
    }, [selectedItems]);

  const totalPrice =
    useMemo(() => {
      return selectedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.ticketType.price *
            item.quantity,
        0
      );
    }, [selectedItems]);

  const currency =
    availableTicketTypes[0]
      ?.currency ?? "LKR";

  const updateQuantity = (
    ticketType: TicketType,
    change: number
  ) => {
    setQuantities(
      (current) => {
        const existing =
          current[
            ticketType.id
          ] ?? 0;

        const next = Math.min(
          Math.max(
            existing + change,
            0
          ),
          ticketType.maxPerOrder
        );

        return {
          ...current,
          [ticketType.id]:
            next,
        };
      }
    );
  };

const handleContinue = () => {
  if (
    selectedItems.length ===
    0
  ) {
    return;
  }

  const selection =
    selectedItems.map(
      ({
        ticketType,
        quantity,
      }) => ({
        ticketTypeId:
          ticketType.id,
        quantity,
      })
    );

  sessionStorage.setItem(
    "laforesta-ticket-selection",
    JSON.stringify({
      eventId: event.id,
      eventSlug:
        event.slug,
      items: selection,
    })
  );

 router.push(
  `/events/${event.slug}/tickets/checkout`
);
};
const router = useRouter();
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      {/* Ticket types */}
      <div>
        <div className="border-t border-white/10">
          {availableTicketTypes.length >
          0 ? (
            availableTicketTypes.map(
              (ticketType) => {
                const quantity =
                  quantities[
                    ticketType.id
                  ] ?? 0;

                return (
                  <article
                    key={
                      ticketType.id
                    }
                    className="border-b border-white/10 py-8 sm:py-10"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <div className="flex size-11 shrink-0 items-center justify-center border border-white/10">
                        <Ticket className="size-4 text-electric" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="font-display text-2xl tracking-[-0.04em] sm:text-3xl">
                              {
                                ticketType.name
                              }
                            </h2>

                            {ticketType.description && (
                              <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
                                {
                                  ticketType.description
                                }
                              </p>
                            )}

                            <p className="font-technical mt-4 text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                              Maximum{" "}
                              {
                                ticketType.maxPerOrder
                              }{" "}
                              per order
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="font-display text-2xl tracking-[-0.04em] sm:text-3xl">
                              {formatMoney(
                                ticketType.price,
                                ticketType.currency
                              )}
                            </p>

                            <p className="font-technical mt-1 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                              Per ticket
                            </p>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                          <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                            Quantity
                          </span>

                          <div className="flex items-center border border-white/10">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  ticketType,
                                  -1
                                )
                              }
                              disabled={
                                quantity ===
                                0
                              }
                              className="flex size-11 items-center justify-center transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Decrease ${ticketType.name} quantity`}
                            >
                              <Minus className="size-4" />
                            </button>

                            <span className="font-display flex h-11 min-w-12 items-center justify-center border-x border-white/10 text-lg">
                              {quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  ticketType,
                                  1
                                )
                              }
                              disabled={
                                quantity >=
                                ticketType.maxPerOrder
                              }
                              className="flex size-11 items-center justify-center transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Increase ${ticketType.name} quantity`}
                            >
                              <Plus className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )
          ) : (
            <div className="border-b border-white/10 py-12">
              <p className="text-lg text-muted-foreground">
                Ticket sales are not
                currently available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order summary */}
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="border border-white/10 bg-card/50 p-6 backdrop-blur-xl sm:p-7">
          <p className="font-technical text-[9px] uppercase tracking-[0.22em] text-electric">
            Your selection
          </p>

          <h3 className="font-display mt-4 text-3xl tracking-[-0.045em]">
            {event.title}
          </h3>

          <div className="mt-8 border-t border-white/10">
            {selectedItems.length >
            0 ? (
              selectedItems.map(
                ({
                  ticketType,
                  quantity,
                }) => (
                  <div
                    key={
                      ticketType.id
                    }
                    className="flex justify-between gap-5 border-b border-white/10 py-5"
                  >
                    <div>
                      <p className="text-sm">
                        {
                          ticketType.name
                        }
                      </p>

                      <p className="font-technical mt-1 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                        Qty{" "}
                        {quantity}
                      </p>
                    </div>

                    <p className="font-display text-lg">
                      {formatMoney(
                        ticketType.price *
                          quantity,
                        ticketType.currency
                      )}
                    </p>
                  </div>
                )
              )
            ) : (
              <p className="border-b border-white/10 py-6 text-sm leading-7 text-muted-foreground">
                Choose your ticket
                quantity to continue.
              </p>
            )}
          </div>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Total
              </p>

              <p className="font-technical mt-2 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                {totalQuantity}{" "}
                {totalQuantity === 1
                  ? "ticket"
                  : "tickets"}
              </p>
            </div>

            <p className="font-display text-3xl tracking-[-0.045em]">
              {formatMoney(
                totalPrice,
                currency
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={
              selectedItems.length ===
              0
            }
            onClick={
              handleContinue
            }
            className="group mt-7 flex min-h-14 w-full items-center justify-between bg-electric px-5 text-background transition-all hover:bg-electric/90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="font-technical text-[10px] uppercase tracking-[0.2em]">
              Continue
            </span>

            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <p className="font-technical mt-4 text-[8px] uppercase leading-5 tracking-[0.16em] text-muted-foreground">
            Tickets are not reserved
            until the next step is
            completed.
          </p>
        </div>
      </aside>
    </div>
  );
}