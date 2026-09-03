"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  getRegisteredOrders,
  OrderApiError,
} from "@/lib/api/orders";
import {
  formatEventDate,
  formatMoney,
} from "@/lib/formatters";
import type {
  Order,
  OrderStatus,
} from "@/types/order";

const statusStyles: Record<
  OrderStatus,
  string
> = {
  PAID: "border-electric/30 text-electric",
  PENDING_PAYMENT:
    "border-amber-400/30 text-amber-300",
  PAYMENT_FAILED:
    "border-destructive/30 text-destructive",
  CANCELLED:
    "border-white/15 text-muted-foreground",
  REFUNDED:
    "border-sky-400/30 text-sky-300",
};

function formatStatus(status: OrderStatus) {
  return status.replaceAll("_", " ");
}

function getTicketCount(order: Order) {
  return order.items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

export function AccountOrdersClient() {
  const router = useRouter();
  const [orders, setOrders] =
    useState<Order[] | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const result =
          await getRegisteredOrders();

        if (active) {
          setOrders(result);
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
            "/login?next=/account/orders"
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load orders."
        );
      }
    };

    void loadOrders();

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

  if (orders === null) {
    return (
      <div className="border border-white/10 bg-card/40 p-6">
        <span className="block size-2 animate-pulse rounded-full bg-electric" />
        <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Loading orders
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
        <ReceiptText className="size-8 text-electric" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          No registered orders yet.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Complete a purchase while signed
          in and its status, items and total
          will appear here.
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
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </p>
        <Link
          href="/account/tickets"
          className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          My tickets
        </Link>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const ticketCount =
            getTicketCount(order);

          return (
            <Link
              key={order.orderId}
              href={`/account/orders/${order.orderId}`}
              className="group border border-white/10 bg-card/40 p-5 transition-colors hover:border-electric/35 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                    {formatEventDate(
                      order.createdAt
                    )}
                  </p>
                  <p className="mt-3 font-technical text-[9px] uppercase tracking-[0.12em] text-foreground">
                    Order {order.orderId.slice(0, 8)}
                  </p>
                </div>

                <span
                  className={`border px-3 py-2 font-technical text-[8px] uppercase tracking-[0.16em] ${statusStyles[order.status]}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>

              <div className="mt-7 flex items-end justify-between gap-5 border-t border-white/10 pt-5">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {ticketCount}{" "}
                    {ticketCount === 1
                      ? "ticket"
                      : "tickets"}
                  </p>
                  <p className="font-display mt-2 text-2xl tracking-[-0.04em]">
                    {formatMoney(
                      order.totalAmount,
                      order.currency
                    )}
                  </p>
                </div>

                <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-electric" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
