"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldAlert,
  TicketCheck,
  Undo2,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/api/auth";
import {
  findOrdersByEmail,
  getAdminOrder,
  OperationsApiError,
  refundAdminOrder,
} from "@/lib/api/operations";
import { formatMoney } from "@/lib/formatters";
import type { CurrentUser } from "@/types/auth";
import type { OrderStatus } from "@/types/order";
import type {
  AdminOrder,
  AdminOrderSummary,
  RefundResponse,
} from "@/types/operations";

const OPERATIONS_ROLES = new Set([
  "FINANCE_MANAGER",
  "SUPPORT_AGENT",
  "ADMIN",
  "SUPER_ADMIN",
]);

const REFUND_ROLES = new Set([
  "FINANCE_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
]);

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

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Colombo",
    }
  ).format(new Date(value));
}

function formatStatus(value: string) {
  return value.replaceAll("_", " ");
}

export function OrderOperationsClient() {
  const router = useRouter();
  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<
    AdminOrderSummary[] | null
  >(null);
  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const authorized = Boolean(
    user?.roles.some((role) =>
      OPERATIONS_ROLES.has(role)
    )
  );

  const canRefund = Boolean(
    user?.roles.some((role) =>
      REFUND_ROLES.has(role)
    )
  );

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const currentUser =
          await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
          router.replace(
            "/login?next=/operations/orders"
          );
        }
      }
    };

    void loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  const handleApiError = (
    caught: unknown,
    fallback: string
  ) => {
    if (
      caught instanceof OperationsApiError &&
      caught.status === 401
    ) {
      router.replace(
        "/login?next=/operations/orders"
      );
      return;
    }

    setError(
      caught instanceof Error
        ? caught.message
        : fallback
    );
  };

  const handleSearch = async (
    submitEvent: FormEvent<HTMLFormElement>
  ) => {
    submitEvent.preventDefault();

    if (!email.trim()) {
      setError(
        "Enter a registered customer email."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedOrder(null);

    try {
      const result = await findOrdersByEmail(
        email
      );
      setOrders(result);
    } catch (caught) {
      handleApiError(
        caught,
        "Unable to search orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = async (
    orderId: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result =
        await getAdminOrder(orderId);
      setSelectedOrder(result);
    } catch (caught) {
      handleApiError(
        caught,
        "Unable to load this order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined || user === null) {
    return <OperationsLoading label="Verifying operations access" />;
  }

  if (!authorized) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
        <ShieldAlert className="size-9 text-destructive" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          Operations access required.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Order operations are restricted to
          support, finance and administrator roles.
        </p>
        <Link
          href="/account"
          className="font-technical mt-8 inline-block text-[9px] uppercase tracking-[0.2em] text-electric"
        >
          Return to account
        </Link>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <AdminOrderDetail
        order={selectedOrder}
        canRefund={canRefund}
        onBack={() => {
          setSelectedOrder(null);
          setError(null);
        }}
        onOrderChange={setSelectedOrder}
      />
    );
  }

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSearch}
        className="border border-white/10 bg-card/40 p-5 sm:p-6"
      >
        <label
          htmlFor="customerEmail"
          className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Registered customer email
        </label>
        <input
          id="customerEmail"
          type="email"
          value={email}
          onChange={(changeEvent) =>
            setEmail(changeEvent.target.value)
          }
          required
          maxLength={255}
          autoComplete="off"
          placeholder="customer@example.com"
          className="mt-3 h-14 w-full border border-white/10 bg-transparent px-4 outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-electric"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 flex min-h-12 w-full items-center justify-between bg-electric px-4 text-background disabled:cursor-wait disabled:opacity-50"
        >
          <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
            {loading
              ? "Searching..."
              : "Find orders"}
          </span>
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </button>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          The current Spring search contract returns
          registered purchases only. Guest orders are
          not searchable by this endpoint.
        </p>
      </form>

      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-5 text-sm leading-6 text-destructive">
          {error}
        </div>
      )}

      {orders !== null &&
        (orders.length === 0 ? (
          <div className="border border-white/10 bg-card/40 p-6">
            <ReceiptText className="size-8 text-muted-foreground" />
            <h2 className="font-display mt-7 text-3xl tracking-[-0.04em]">
              No orders found.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Check the customer email and try again.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <button
                key={order.orderId}
                type="button"
                onClick={() =>
                  void handleOpenOrder(
                    order.orderId
                  )
                }
                disabled={loading}
                className="group border border-white/10 bg-card/40 p-5 text-left transition-colors hover:border-electric/35 disabled:opacity-50 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-xl tracking-[-0.03em]">
                      {order.customerName}
                    </p>
                    <p className="mt-2 break-all text-xs text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </div>
                  <span
                    className={`border px-3 py-2 font-technical text-[8px] uppercase tracking-[0.16em] ${statusStyles[order.status]}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-5 border-t border-white/10 pt-5">
                  <div>
                    <p className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
                      {formatTimestamp(
                        order.createdAt
                      )}
                    </p>
                    <p className="font-display mt-2 text-2xl tracking-[-0.04em]">
                      {formatMoney(
                        order.totalAmount,
                        order.currency
                      )}
                    </p>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-electric" />
                </div>
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}

function AdminOrderDetail({
  order,
  canRefund,
  onBack,
  onOrderChange,
}: {
  order: AdminOrder;
  canRefund: boolean;
  onBack: () => void;
  onOrderChange: (order: AdminOrder) => void;
}) {
  const [showRefund, setShowRefund] =
    useState(false);
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [refundResult, setRefundResult] =
    useState<RefundResponse | null>(null);

  const confirmationCode =
    order.orderId.slice(0, 8).toUpperCase();

  const handleRefund = async (
    submitEvent: FormEvent<HTMLFormElement>
  ) => {
    submitEvent.preventDefault();

    if (!reason.trim()) {
      setError("A refund reason is required.");
      return;
    }

    if (
      confirmation.trim().toUpperCase() !==
      confirmationCode
    ) {
      setError(
        "Enter the displayed confirmation code exactly."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await refundAdminOrder(
        order.orderId,
        reason
      );
      const refreshed = await getAdminOrder(
        order.orderId
      );

      setRefundResult(result);
      setShowRefund(false);
      onOrderChange(refreshed);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to refund this order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-3 font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="size-3.5" />
        Back to results
      </button>

      <div className="border border-white/10 bg-card/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
              Customer
            </p>
            <p className="mt-2 break-all text-sm">
              {order.customerEmail}
            </p>
          </div>
          <span
            className={`border px-3 py-2 font-technical text-[8px] uppercase tracking-[0.16em] ${statusStyles[order.status]}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
            Order ID
          </p>
          <p className="mt-2 break-all text-xs">
            {order.orderId}
          </p>
        </div>

        <div className="mt-6 border-t border-white/10">
          {order.items.map((item) => (
            <div
              key={item.ticketTypeId}
              className="flex justify-between gap-5 border-b border-white/10 py-5"
            >
              <div>
                <p className="text-sm">
                  {item.ticketTypeName}
                </p>
                <p className="font-technical mt-2 text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
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

        <div className="mt-6 space-y-3 text-sm">
          <MoneyRow
            label="Subtotal"
            amount={order.subtotalAmount}
            currency={order.currency}
          />
          <MoneyRow
            label={
              order.promoCode
                ? `Discount / ${order.promoCode}`
                : "Discount"
            }
            amount={-order.discountAmount}
            currency={order.currency}
          />
          <div className="flex items-end justify-between border-t border-white/10 pt-5">
            <span className="font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              Total
            </span>
            <span className="font-display text-3xl tracking-[-0.04em]">
              {formatMoney(
                order.totalAmount,
                order.currency
              )}
            </span>
          </div>
        </div>
      </div>

      <OperationsSection
        title="Payments"
        icon={<CreditCard className="size-4" />}
        empty="No payment transactions."
        hasItems={order.payments.length > 0}
      >
        {order.payments.map((payment) => (
          <TransactionRow
            key={payment.paymentId}
            title={`${payment.provider} / ${payment.status}`}
            reference={payment.providerReference}
            amount={formatMoney(
              payment.amount,
              payment.currency
            )}
            createdAt={payment.createdAt}
          />
        ))}
      </OperationsSection>

      <OperationsSection
        title="Tickets"
        icon={<TicketCheck className="size-4" />}
        empty="No tickets issued."
        hasItems={order.tickets.length > 0}
      >
        {order.tickets.map((ticket) => (
          <div
            key={ticket.ticketId}
            className="flex flex-wrap justify-between gap-4 border-b border-white/10 py-4 last:border-0"
          >
            <div>
              <p className="text-sm">
                {ticket.ticketTypeName}
              </p>
              <p className="font-technical mt-2 text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
                {ticket.ticketNumber}
              </p>
            </div>
            <span className="font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              {ticket.status}
            </span>
          </div>
        ))}
      </OperationsSection>

      <OperationsSection
        title="Refunds"
        icon={<Undo2 className="size-4" />}
        empty="No refund transactions."
        hasItems={order.refunds.length > 0}
      >
        {order.refunds.map((refund) => (
          <TransactionRow
            key={refund.refundId}
            title={`${refund.provider} / ${refund.status}`}
            reference={
              refund.reason ??
              refund.providerReference
            }
            amount={formatMoney(
              refund.amount,
              refund.currency
            )}
            createdAt={refund.createdAt}
          />
        ))}
      </OperationsSection>

      {refundResult && (
        <div className="border border-electric/30 bg-electric/[0.05] p-5">
          <div className="flex items-start gap-3">
            <Check className="mt-0.5 size-5 text-electric" />
            <div>
              <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric">
                Refund completed
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatMoney(
                  refundResult.amount,
                  refundResult.currency
                )}{" "}
                returned through {refundResult.provider}.
              </p>
            </div>
          </div>
        </div>
      )}

      {canRefund && order.status === "PAID" && (
        <div className="border border-destructive/30 bg-destructive/[0.03] p-5 sm:p-6">
          {!showRefund ? (
            <>
              <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-destructive">
                Destructive operation
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                A full refund changes the order to
                refunded and invalidates every ticket.
                The current backend uses MOCK refunds.
              </p>
              <button
                type="button"
                onClick={() => setShowRefund(true)}
                className="mt-6 flex min-h-12 w-full items-center justify-between border border-destructive/40 px-4 text-destructive"
              >
                <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
                  Prepare full refund
                </span>
                <Undo2 className="size-4" />
              </button>
            </>
          ) : (
            <form onSubmit={handleRefund}>
              <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-destructive">
                Confirm full MOCK refund
              </p>

              <label
                htmlFor="refundReason"
                className="font-technical mt-6 block text-[8px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                Reason
              </label>
              <textarea
                id="refundReason"
                value={reason}
                onChange={(changeEvent) =>
                  setReason(
                    changeEvent.target.value
                  )
                }
                required
                maxLength={255}
                rows={3}
                className="mt-3 w-full resize-none border border-white/10 bg-transparent p-4 text-sm outline-none focus:border-destructive"
              />

              <label
                htmlFor="refundConfirmation"
                className="font-technical mt-5 block text-[8px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                Type {confirmationCode} to confirm
              </label>
              <input
                id="refundConfirmation"
                value={confirmation}
                onChange={(changeEvent) =>
                  setConfirmation(
                    changeEvent.target.value
                  )
                }
                required
                autoComplete="off"
                className="mt-3 h-12 w-full border border-white/10 bg-transparent px-4 font-technical uppercase outline-none focus:border-destructive"
              />

              {error && (
                <p className="mt-4 text-sm leading-6 text-destructive">
                  {error}
                </p>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRefund(false);
                    setError(null);
                  }}
                  disabled={loading}
                  className="min-h-12 border border-white/10 px-4 font-technical text-[8px] uppercase tracking-[0.18em]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-h-12 items-center justify-between bg-destructive px-4 text-destructive-foreground disabled:opacity-50"
                >
                  <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
                    {loading
                      ? "Refunding..."
                      : "Issue full refund"}
                  </span>
                  {loading ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Undo2 className="size-4" />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!canRefund && order.status === "PAID" && (
        <p className="border border-white/10 p-5 text-xs leading-6 text-muted-foreground">
          Support access is read-only. A finance
          manager or administrator must authorize refunds.
        </p>
      )}
    </div>
  );
}

function MoneyRow({
  label,
  amount,
  currency,
}: {
  label: string;
  amount: number;
  currency: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-muted-foreground">
      <span>{label}</span>
      <span>{formatMoney(amount, currency)}</span>
    </div>
  );
}

function OperationsSection({
  title,
  icon,
  empty,
  hasItems,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  empty: string;
  hasItems: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5 text-electric">
        {icon}
        <h3 className="font-technical text-[9px] uppercase tracking-[0.2em]">
          {title}
        </h3>
      </div>
      {hasItems ? (
        children
      ) : (
        <p className="py-6 text-sm text-muted-foreground">
          {empty}
        </p>
      )}
    </div>
  );
}

function TransactionRow({
  title,
  reference,
  amount,
  createdAt,
}: {
  title: string;
  reference: string | null;
  amount: string;
  createdAt: string;
}) {
  return (
    <div className="flex flex-wrap justify-between gap-4 border-b border-white/10 py-4 last:border-0">
      <div>
        <p className="text-sm">{title}</p>
        <p className="mt-2 break-all text-xs text-muted-foreground">
          {reference ?? "No provider reference"}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-lg">
          {amount}
        </p>
        <p className="font-technical mt-2 text-[7px] uppercase tracking-[0.12em] text-muted-foreground">
          {formatTimestamp(createdAt)}
        </p>
      </div>
    </div>
  );
}

function OperationsLoading({
  label,
}: {
  label: string;
}) {
  return (
    <div className="border border-white/10 bg-card/40 p-6">
      <LoaderCircle className="size-5 animate-spin text-electric" />
      <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
