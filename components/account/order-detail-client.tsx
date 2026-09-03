"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import {
  getRegisteredOrder,
  OrderApiError,
} from "@/lib/api/orders";
import { formatMoney } from "@/lib/formatters";
import type { Order } from "@/types/order";

export function OrderDetailClient({
  orderId,
}: {
  orderId: string;
}) {
  const router = useRouter();
  const [order, setOrder] =
    useState<Order | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      try {
        const result =
          await getRegisteredOrder(
            orderId
          );

        if (active) {
          setOrder(result);
        }
      } catch (caught) {
        if (!active) {
          return;
        }

        if (
          caught instanceof OrderApiError &&
          caught.status === 401
        ) {
          router.replace(
            `/login?next=${encodeURIComponent(
              `/account/orders/${orderId}`
            )}`
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load this order."
        );
      }
    };

    void loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, router]);

  if (error) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm leading-7 text-destructive">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="border border-white/10 bg-card/40 p-6">
        <span className="block size-2 animate-pulse rounded-full bg-electric" />
        <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Loading order
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            Order ID
          </p>
          <p className="mt-3 break-all text-sm">
            {order.orderId}
          </p>
        </div>
        <span className="border border-electric/30 px-3 py-2 font-technical text-[8px] uppercase tracking-[0.18em] text-electric">
          {order.status}
        </span>
      </div>

      <div className="mt-8 border-t border-white/10">
        {order.items.map((item) => (
          <div
            key={item.ticketTypeId}
            className="flex justify-between gap-5 border-b border-white/10 py-5"
          >
            <div>
              <p>{item.ticketTypeName}</p>
              <p className="font-technical mt-2 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                Qty {item.quantity}
              </p>
            </div>
            <p className="font-display text-xl">
              {formatMoney(
                item.lineTotal,
                item.currency
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>
            {formatMoney(
              order.subtotalAmount,
              order.currency
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Discount
            {order.promoCode
              ? ` / ${order.promoCode}`
              : ""}
          </span>
          <span>
            −{formatMoney(
              order.discountAmount,
              order.currency
            )}
          </span>
        </div>
        <div className="flex items-end justify-between border-t border-white/10 pt-5">
          <span className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            Total
          </span>
          <span className="font-display text-3xl">
            {formatMoney(
              order.totalAmount,
              order.currency
            )}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
        <Link
          href="/account/orders"
          className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric"
        >
          All orders
        </Link>
        <Link
          href="/account/tickets"
          className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          My tickets
        </Link>
      </div>
    </div>
  );
}
