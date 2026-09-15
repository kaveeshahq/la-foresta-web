"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CircleUserRound,
  LoaderCircle,
  MailCheck,
  MailWarning,
  Search,
  ShieldAlert,
  TicketCheck,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/api/auth";
import { findOrdersByEmail } from "@/lib/api/operations";
import {
  findCustomerByEmail,
  findTicketByNumber,
  SupportApiError,
} from "@/lib/api/support";
import { formatMoney } from "@/lib/formatters";
import type { CurrentUser } from "@/types/auth";
import type {
  AdminOrderSummary,
} from "@/types/operations";
import type { OrderStatus } from "@/types/order";
import type {
  AdminCustomer,
  AdminTicketLookup,
} from "@/types/support";

const SUPPORT_ROLES = new Set([
  "SUPPORT_AGENT",
  "ADMIN",
  "SUPER_ADMIN",
]);

const orderStatusStyles: Record<OrderStatus, string> = {
  PAID: "border-electric/30 text-electric",
  PENDING_PAYMENT: "border-amber-400/30 text-amber-300",
  PAYMENT_FAILED: "border-destructive/30 text-destructive",
  CANCELLED: "border-white/15 text-muted-foreground",
  REFUNDED: "border-sky-400/30 text-sky-300",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Colombo",
  }).format(new Date(value));
}

export function SupportDeskClient() {
  const router = useRouter();
  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [customer, setCustomer] =
    useState<AdminCustomer | null>(null);
  const [orders, setOrders] =
    useState<AdminOrderSummary[] | null>(null);
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticket, setTicket] =
    useState<AdminTicketLookup | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [customerError, setCustomerError] =
    useState<string | null>(null);
  const [ticketError, setTicketError] =
    useState<string | null>(null);

  const authorized = Boolean(
    user?.roles.some((role) => SUPPORT_ROLES.has(role))
  );

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (active) setUser(currentUser);
      } catch (caught) {
        if (!active) return;

        if (
          caught instanceof Error &&
          "status" in caught &&
          caught.status === 401
        ) {
          router.replace("/login?next=/operations/support");
          return;
        }

        setUser(null);
        setCustomerError(
          caught instanceof Error
            ? caught.message
            : "Unable to verify support access."
        );
      }
    };

    void loadUser();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSessionError = (caught: unknown) => {
    if (
      caught instanceof SupportApiError &&
      caught.status === 401
    ) {
      router.replace("/login?next=/operations/support");
      return true;
    }

    return false;
  };

  const searchCustomer = async (
    submitEvent: FormEvent<HTMLFormElement>
  ) => {
    submitEvent.preventDefault();
    const normalizedEmail = email.trim();

    setCustomerLoading(true);
    setCustomerError(null);
    setCustomer(null);
    setOrders(null);
    setSearchedEmail(normalizedEmail);

    try {
      const [customerResult, orderResult] = await Promise.allSettled([
        findCustomerByEmail(normalizedEmail),
        findOrdersByEmail(normalizedEmail),
      ]);

      if (orderResult.status === "rejected") {
        throw orderResult.reason;
      }

      setOrders(orderResult.value);

      if (customerResult.status === "fulfilled") {
        setCustomer(customerResult.value);
      } else if (
        !(
          customerResult.reason instanceof SupportApiError &&
          customerResult.reason.status === 404
        )
      ) {
        throw customerResult.reason;
      }
    } catch (caught) {
      if (handleSessionError(caught)) return;

      setCustomerError(
        caught instanceof Error
          ? caught.message
          : "Unable to complete the customer search."
      );
    } finally {
      setCustomerLoading(false);
    }
  };

  const searchTicket = async (
    submitEvent: FormEvent<HTMLFormElement>
  ) => {
    submitEvent.preventDefault();
    setTicketLoading(true);
    setTicketError(null);
    setTicket(null);

    try {
      setTicket(await findTicketByNumber(ticketNumber));
    } catch (caught) {
      if (handleSessionError(caught)) return;

      setTicketError(
        caught instanceof Error
          ? caught.message
          : "Unable to complete the ticket search."
      );
    } finally {
      setTicketLoading(false);
    }
  };

  if (user === undefined) {
    return <SupportLoading label="Verifying support access" />;
  }

  if (!authorized) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
        <ShieldAlert className="size-9 text-destructive" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          Support access required.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          This workspace is restricted to support staff and administrators.
        </p>
        <Link
          href="/dashboard"
          className="font-technical mt-8 inline-block text-[9px] uppercase tracking-[0.2em] text-electric"
        >
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SearchPanel
        title="Customer and orders"
        label="Customer email"
        value={email}
        placeholder="customer@example.com"
        loading={customerLoading}
        onChange={setEmail}
        onSubmit={searchCustomer}
      />

      {customerError && <ErrorPanel message={customerError} />}

      {orders !== null && (
        <CustomerResults
          customer={customer}
          orders={orders}
          searchedEmail={searchedEmail}
        />
      )}

      <SearchPanel
        title="Ticket record"
        label="Ticket number"
        value={ticketNumber}
        placeholder="LF-..."
        loading={ticketLoading}
        onChange={setTicketNumber}
        onSubmit={searchTicket}
      />

      {ticketError && <ErrorPanel message={ticketError} />}
      {ticket && <TicketResult ticket={ticket} />}

      <p className="border border-white/10 p-5 text-xs leading-6 text-muted-foreground">
        Support Desk is read-only. Refunds remain restricted to finance managers
        and administrators inside Order Operations.
      </p>
    </div>
  );
}

function SearchPanel({
  title,
  label,
  value,
  placeholder,
  loading,
  onChange,
  onSubmit,
}: {
  title: string;
  label: string;
  value: string;
  placeholder: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border border-white/10 bg-card/40 p-5 sm:p-6"
    >
      <p className="font-technical border-b border-white/10 pb-5 text-[9px] uppercase tracking-[0.2em] text-electric">
        {title}
      </p>
      <label className="font-technical mt-5 block text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        <input
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="mt-3 h-14 w-full border border-white/10 bg-transparent px-4 font-sans text-sm normal-case tracking-normal text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-electric"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-3 flex min-h-12 w-full items-center justify-between bg-electric px-4 text-background disabled:cursor-wait disabled:opacity-50"
      >
        <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
          {loading ? "Searching..." : "Search records"}
        </span>
        {loading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <Search className="size-4" />
        )}
      </button>
    </form>
  );
}

function CustomerResults({
  customer,
  orders,
  searchedEmail,
}: {
  customer: AdminCustomer | null;
  orders: AdminOrderSummary[];
  searchedEmail: string;
}) {
  return (
    <section className="border border-white/10 bg-card/40 p-5 sm:p-6">
      {customer ? (
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-2xl tracking-[-0.04em]">
                {customer.fullName}
              </p>
              <p className="mt-2 break-all text-xs text-muted-foreground">
                {customer.email}
              </p>
            </div>
            <CircleUserRound className="size-6 text-electric" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <StatusBadge value={customer.accountStatus} />
            <span className={`flex items-center gap-2 border px-3 py-2 font-technical text-[7px] uppercase tracking-[0.14em] ${customer.emailVerified ? "border-electric/30 text-electric" : "border-amber-400/30 text-amber-300"}`}>
              {customer.emailVerified ? (
                <MailCheck className="size-3" />
              ) : (
                <MailWarning className="size-3" />
              )}
              {customer.emailVerified ? "Email verified" : "Email unverified"}
            </span>
          </div>
          <p className="font-technical mt-4 text-[7px] uppercase tracking-[0.14em] text-muted-foreground">
            Account created {formatDate(customer.createdAt)}
          </p>
        </div>
      ) : (
        <div>
          <p className="font-display text-2xl tracking-[-0.04em]">
            No registered account
          </p>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Orders below, if present, were placed through guest checkout.
          </p>
        </div>
      )}

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-technical text-[9px] uppercase tracking-[0.18em] text-electric">
            Orders
          </p>
          <span className="font-technical text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
            {orders.length} found
          </span>
        </div>

        {orders.length ? (
          <div className="mt-3">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="grid gap-3 border-b border-white/10 py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm">{order.customerName}</p>
                    <span className="border border-white/15 px-2 py-1 font-technical text-[7px] uppercase tracking-[0.13em] text-muted-foreground">
                      {order.guest ? "Guest" : "Registered"}
                    </span>
                  </div>
                  <p className="font-technical mt-2 break-all text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                    {order.orderId}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className={`inline-block border px-2 py-1 font-technical text-[7px] uppercase tracking-[0.13em] ${orderStatusStyles[order.status]}`}>
                    {order.status.replaceAll("_", " ")}
                  </span>
                  <p className="font-display mt-2 text-xl">
                    {formatMoney(order.totalAmount, order.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-sm text-muted-foreground">
            No orders found for this email.
          </p>
        )}

        {orders.length > 0 && (
          <Link
            href={`/operations/orders?email=${encodeURIComponent(searchedEmail)}`}
            className="mt-4 flex min-h-12 items-center justify-between border border-electric/30 px-4 text-electric"
          >
            <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
              Open in Order Operations
            </span>
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </section>
  );
}

function TicketResult({ ticket }: { ticket: AdminTicketLookup }) {
  const registered = ticket.userId !== null;

  return (
    <section className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            Ticket number
          </p>
          <p className="font-display mt-2 break-all text-2xl tracking-[-0.04em]">
            {ticket.ticketNumber}
          </p>
        </div>
        <TicketCheck className="size-6 text-electric" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
        <StatusBadge value={ticket.status} />
        <StatusBadge value={registered ? "REGISTERED" : "GUEST"} />
      </div>

      <dl className="mt-6 space-y-4 text-sm">
        <ResultRow label="Event" value={ticket.eventTitle} />
        <ResultRow label="Ticket type" value={ticket.ticketTypeName} />
        <ResultRow
          label="Customer"
          value={ticket.customerName ?? "Guest ticket holder"}
        />
        <ResultRow
          label="Email"
          value={ticket.customerEmail ?? "Available in protected order details"}
        />
        <ResultRow label="Order ID" value={ticket.orderId} mono />
        <ResultRow label="Issued" value={formatDate(ticket.createdAt)} />
      </dl>

      <Link
        href={
          ticket.customerEmail
            ? `/operations/orders?email=${encodeURIComponent(ticket.customerEmail)}`
            : "/operations/orders"
        }
        className="mt-6 flex min-h-12 items-center justify-between border border-electric/30 px-4 text-electric"
      >
        <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
          Open Order Operations
        </span>
        <ArrowRight className="size-4" />
      </Link>
    </section>
  );
}

function ResultRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1 border-b border-white/10 pb-4 sm:grid-cols-[7rem_1fr]">
      <dt className="font-technical text-[7px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className={`${mono ? "font-technical text-[8px]" : ""} break-all sm:text-right`}>
        {value}
      </dd>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="border border-electric/25 px-3 py-2 font-technical text-[7px] uppercase tracking-[0.14em] text-electric">
      {value.replaceAll("_", " ")}
    </span>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="border border-destructive/30 bg-destructive/5 p-5 text-sm leading-6 text-destructive">
      {message}
    </div>
  );
}

function SupportLoading({ label }: { label: string }) {
  return (
    <div className="border border-white/10 bg-card/40 p-6">
      <LoaderCircle className="size-5 animate-spin text-electric" />
      <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
