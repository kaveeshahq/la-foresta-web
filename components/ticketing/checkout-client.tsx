"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  LoaderCircle,
  TicketCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ReservationTimer } from "@/components/ticketing/reservation-timer";

import {
  createGuestOrder,
  createRegisteredOrder,
} from "@/lib/api/orders";

import {
  completeGuestMockPayment,
  completeRegisteredMockPayment,
  failGuestMockPayment,
  failRegisteredMockPayment,
  initiateGuestMockPayment,
  initiateRegisteredMockPayment,
} from "@/lib/api/payments";

import {
  createGuestReservation,
  createRegisteredReservation,
} from "@/lib/api/reservations";

import {
  getGuestTickets,
  getRegisteredTickets,
} from "@/lib/api/tickets";

import { getCurrentUser } from "@/lib/api/auth";

import { formatMoney } from "@/lib/formatters";

import type { TicketSelection } from "@/types/checkout";
import type { CurrentUser } from "@/types/auth";
import type { Event } from "@/types/events";
import type { Order } from "@/types/order";
import type { Payment } from "@/types/payment";
import type { Reservation } from "@/types/reservation";
import type { Ticket } from "@/types/ticket";
import type { TicketType } from "@/types/ticket-type";

type CheckoutClientProps = {
  event: Event;
  ticketTypes: TicketType[];
};

type CheckoutStep =
  | "choice"
  | "guest"
  | "reserved"
  | "order"
  | "payment"
  | "complete";

type CheckoutMode =
  | "guest"
  | "registered";

const SELECTION_KEY =
  "laforesta-ticket-selection";

const RESERVATION_KEY =
  "laforesta-reservation";

const GUEST_ORDER_KEY =
  "laforesta-guest-order";

const GUEST_ACCESS_TOKEN_KEY =
  "laforesta-guest-access-token";

const PAYMENT_KEY =
  "laforesta-payment";

const TICKETS_KEY =
  "laforesta-guest-tickets";

const CHECKOUT_PROGRESS_KEY =
  "laforesta-checkout-progress-v1";

type CheckoutProgress = {
  version: 1;
  eventId: string;
  eventSlug: string;
  checkoutMode: CheckoutMode;
  ownerUserId: string | null;
  reservation: Reservation;
  order: Order | null;
  payment: Payment | null;
};

function readCheckoutProgress(
  eventId: string,
  eventSlug: string
) {
  const stored = sessionStorage.getItem(
    CHECKOUT_PROGRESS_KEY
  );

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      stored
    ) as CheckoutProgress;

    if (
      parsed.version !== 1 ||
      parsed.eventId !== eventId ||
      parsed.eventSlug !== eventSlug ||
      ![
        "guest",
        "registered",
      ].includes(parsed.checkoutMode) ||
      !parsed.reservation
        ?.reservationId
    ) {
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(
      CHECKOUT_PROGRESS_KEY
    );
    return null;
  }
}

function clearStoredCheckoutProgress() {
  [
    CHECKOUT_PROGRESS_KEY,
    RESERVATION_KEY,
    GUEST_ORDER_KEY,
    PAYMENT_KEY,
    GUEST_ACCESS_TOKEN_KEY,
  ].forEach((key) =>
    sessionStorage.removeItem(key)
  );
}

export function CheckoutClient({
  event,
  ticketTypes,
}: CheckoutClientProps) {
  const router = useRouter();

  const [
    selection,
    setSelection,
  ] =
    useState<TicketSelection | null>(
      null
    );

  const [
    step,
    setStep,
  ] =
    useState<CheckoutStep>(
      "choice"
    );

  const [
    guestName,
    setGuestName,
  ] = useState("");

  const [
    guestEmail,
    setGuestEmail,
  ] = useState("");

  const [
    reservation,
    setReservation,
  ] =
    useState<Reservation | null>(
      null
    );

  const [
    order,
    setOrder,
  ] =
    useState<Order | null>(
      null
    );

  const [
    checkoutMode,
    setCheckoutMode,
  ] =
    useState<CheckoutMode | null>(
      null
    );

  const [
    currentUser,
    setCurrentUser,
  ] = useState<
    CurrentUser | null | undefined
  >(undefined);

  const [promoCode, setPromoCode] =
    useState("");

  const [
    payment,
    setPayment,
  ] =
    useState<Payment | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    reservationExpired,
    setReservationExpired,
  ] = useState(false);

  const [
    recoveredCheckout,
    setRecoveredCheckout,
  ] = useState(false);

  useEffect(() => {
    const stored =
      sessionStorage.getItem(
        SELECTION_KEY
      );

    if (!stored) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored
        ) as TicketSelection;

      if (
        parsed.eventId !==
          event.id ||
        parsed.eventSlug !==
          event.slug
      ) {
        return;
      }

      const timeoutId =
        window.setTimeout(() => {
          setSelection(parsed);
        }, 0);

      return () =>
        window.clearTimeout(
          timeoutId
        );
    } catch {
      sessionStorage.removeItem(
        SELECTION_KEY
      );
    }
  }, [
    event.id,
    event.slug,
  ]);

  useEffect(() => {
    let active = true;

    const loadCurrentUser = async () => {
      try {
        const user =
          await getCurrentUser();

        if (active) {
          setCurrentUser(user);
        }
      } catch {
        if (active) {
          setCurrentUser(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (currentUser === undefined) {
      return;
    }

    const progress =
      readCheckoutProgress(
        event.id,
        event.slug
      );

    if (!progress) {
      return;
    }

    if (
      progress.checkoutMode ===
        "registered" &&
      !currentUser
    ) {
      return;
    }

    if (
      progress.checkoutMode ===
        "registered" &&
      progress.ownerUserId !==
        currentUser?.userId
    ) {
      clearStoredCheckoutProgress();
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setCheckoutMode(
          progress.checkoutMode
        );
        setReservation(
          progress.reservation
        );
        setOrder(progress.order);
        setPayment(progress.payment);
        setRecoveredCheckout(true);

        const expired =
          !progress.order &&
          (progress.reservation.status !==
            "ACTIVE" ||
            new Date(
              progress.reservation
                .expiresAt
            ).getTime() <= Date.now());

        setReservationExpired(expired);

        if (progress.payment) {
          setStep("payment");

          if (
            progress.payment.status ===
            "FAILED" ||
            progress.payment.status ===
            "CANCELLED"
          ) {
            setError(
              "This payment session can no longer continue. Start again to create a new reservation."
            );
          }
        } else if (progress.order) {
          setStep("order");
        } else {
          setStep("reserved");
        }
      }, 0);

    return () =>
      window.clearTimeout(timeoutId);
  }, [
    currentUser,
    event.id,
    event.slug,
  ]);

  useEffect(() => {
    if (
      !reservation ||
      !checkoutMode
    ) {
      return;
    }

    if (step === "complete") {
      clearStoredCheckoutProgress();
      return;
    }

    const progress: CheckoutProgress = {
      version: 1,
      eventId: event.id,
      eventSlug: event.slug,
      checkoutMode,
      ownerUserId:
        checkoutMode === "registered"
          ? currentUser?.userId ?? null
          : null,
      reservation,
      order,
      payment,
    };

    sessionStorage.setItem(
      CHECKOUT_PROGRESS_KEY,
      JSON.stringify(progress)
    );
  }, [
    checkoutMode,
    currentUser?.userId,
    event.id,
    event.slug,
    order,
    payment,
    reservation,
    step,
  ]);

  const selectedTickets =
    useMemo(() => {
      if (!selection) {
        return [];
      }

      return selection.items
        .map((item) => {
          const ticketType =
            ticketTypes.find(
              (type) =>
                type.id ===
                item.ticketTypeId
            );

          if (!ticketType) {
            return null;
          }

          return {
            ticketType,
            quantity:
              item.quantity,
          };
        })
        .filter(
          (
            item
          ): item is {
            ticketType: TicketType;
            quantity: number;
          } => item !== null
        );
    }, [
      selection,
      ticketTypes,
    ]);

  const calculatedTotal =
    useMemo(() => {
      return selectedTickets.reduce(
        (
          total,
          {
            ticketType,
            quantity,
          }
        ) =>
          total +
          ticketType.price *
            quantity,
        0
      );
    }, [
      selectedTickets,
    ]);

  const currency =
    selectedTickets[0]
      ?.ticketType.currency ??
    "LKR";

  const totalAmount =
    order?.totalAmount ??
    reservation?.totalAmount ??
    calculatedTotal;

  const totalCurrency =
    order?.currency ??
    reservation?.currency ??
    currency;

  const loadIssuedTickets =
    useCallback(
      async (
        mode: CheckoutMode,
        orderId: string
      ) => {
        if (mode === "registered") {
          const allTickets =
            await getRegisteredTickets();

          return allTickets.filter(
            (ticket) =>
              ticket.orderId === orderId
          );
        }

        const accessToken =
          sessionStorage.getItem(
            GUEST_ACCESS_TOKEN_KEY
          );

        if (!accessToken) {
          throw new Error(
            "Guest ticket access token is missing. Use the secure link in your confirmation email."
          );
        }

        return getGuestTickets(
          accessToken
        );
      },
      []
    );

  const clearError = () => {
    setError(null);
  };

  const handleGuestSubmit =
    async (
      submitEvent:
        FormEvent<HTMLFormElement>
    ) => {
      submitEvent.preventDefault();

      if (!selection) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        const result =
          await createGuestReservation(
            {
              guestName:
                guestName.trim(),

              guestEmail:
                guestEmail.trim(),

              items:
                selection.items,
            }
          );

        setReservation(
          result
        );

        sessionStorage.setItem(
          RESERVATION_KEY,
          JSON.stringify(
            result
          )
        );

        setReservationExpired(
          false
        );

        setCheckoutMode("guest");

        setStep(
          "reserved"
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to reserve tickets."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleRegisteredReservation =
    async () => {
      if (!selection) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        const result =
          await createRegisteredReservation(
            {
              items: selection.items,
            }
          );

        setReservation(result);
        setReservationExpired(false);
        setCheckoutMode("registered");

        sessionStorage.setItem(
          RESERVATION_KEY,
          JSON.stringify(result)
        );

        setStep("reserved");
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to reserve tickets."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleCreateOrder =
    async () => {
      if (
        !reservation ||
        reservationExpired
      ) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        if (checkoutMode === "registered") {
          const result =
            await createRegisteredOrder({
              reservationId:
                reservation.reservationId,
              promoCode:
                promoCode.trim() || null,
            });

          setOrder(result);
          setStep("order");
          return;
        }

        const result =
          await createGuestOrder({
            reservationId:
              reservation.reservationId,
            promoCode: null,
          });

        setOrder(result.order);

        /*
         * The backend only returns this
         * raw guest token once.
         *
         * Keep it in sessionStorage,
         * not localStorage.
         */
        sessionStorage.setItem(
          GUEST_ORDER_KEY,
          JSON.stringify(
            result.order
          )
        );

        sessionStorage.setItem(
          GUEST_ACCESS_TOKEN_KEY,
          result.guestAccessToken
        );

        setStep("order");
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to create order."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleInitiatePayment =
    async () => {
      if (!order || !checkoutMode) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        const request = {
          orderId: order.orderId,
        };

        const result =
          checkoutMode === "registered"
            ? await initiateRegisteredMockPayment(
                request
              )
            : await initiateGuestMockPayment(
                request
              );

        setPayment(
          result
        );

        sessionStorage.setItem(
          PAYMENT_KEY,
          JSON.stringify(
            result
          )
        );

        setStep(
          "payment"
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to initiate payment."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleCompleteMockPayment =
    async () => {
      if (
        !payment ||
        !checkoutMode ||
        !order
      ) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        const completed =
          checkoutMode === "registered"
            ? await completeRegisteredMockPayment(
                payment.paymentId
              )
            : await completeGuestMockPayment(
                payment.paymentId
              );

        setPayment(
          completed
        );

        sessionStorage.setItem(
          PAYMENT_KEY,
          JSON.stringify(
            completed
          )
        );

        const tickets: Ticket[] =
          await loadIssuedTickets(
            checkoutMode,
            order.orderId
          );

        if (tickets.length === 0) {
          throw new Error(
            "Payment completed, but no tickets were returned yet."
          );
        }

        sessionStorage.setItem(
          TICKETS_KEY,
          JSON.stringify(
            tickets
          )
        );

        setStep(
          "complete"
        );

        clearStoredCheckoutProgress();

        router.push(
          `/events/${event.slug}/tickets/success`
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to complete payment."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleRecoverTickets =
    async () => {
      if (!order || !checkoutMode) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        const tickets =
          await loadIssuedTickets(
            checkoutMode,
            order.orderId
          );

        if (tickets.length === 0) {
          throw new Error(
            "Payment completed, but no tickets were returned yet."
          );
        }

        sessionStorage.setItem(
          TICKETS_KEY,
          JSON.stringify(tickets)
        );

        setStep("complete");
        clearStoredCheckoutProgress();
        router.push(
          `/events/${event.slug}/tickets/success`
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to retrieve issued tickets."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleFailMockPayment =
    async () => {
      if (!payment) {
        return;
      }

      clearError();
      setLoading(true);

      try {
        const failed =
          checkoutMode === "registered"
            ? await failRegisteredMockPayment(
                payment.paymentId
              )
            : await failGuestMockPayment(
                payment.paymentId
              );

        setPayment(
          failed
        );

        sessionStorage.setItem(
          PAYMENT_KEY,
          JSON.stringify(
            failed
          )
        );

        setError(
          "Mock payment failed. The reservation has been cancelled."
        );
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to fail mock payment."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleReservationExpired =
    useCallback(() => {
      setReservationExpired(
        true
      );
    }, []);

  const handleRestartCheckout =
    useCallback(() => {
      clearStoredCheckoutProgress();
      setReservation(null);
      setOrder(null);
      setPayment(null);
      setCheckoutMode(null);
      setPromoCode("");
      setReservationExpired(false);
      setRecoveredCheckout(false);
      setError(null);
      setStep("choice");
    }, []);

  if (!selection) {
    return (
      <section className="lf-container py-[clamp(5rem,9vw,9rem)]">
        <p className="font-technical text-[10px] uppercase tracking-[0.25em] text-electric">
          Checkout
        </p>

        <h1 className="font-display mt-6 text-[clamp(3.5rem,9vw,7rem)] leading-[0.8] tracking-[-0.07em]">
          No tickets
          <br />
          selected.
        </h1>

        <p className="mt-8 max-w-md text-base leading-8 text-muted-foreground">
          Return to the ticket
          selector and choose at least
          one ticket before continuing.
        </p>

        <Link
          href={`/events/${event.slug}/tickets`}
          className="mt-10 flex w-fit items-center gap-3 font-technical text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="size-4" />

          Select tickets
        </Link>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-[clamp(5rem,9vw,9rem)]">
      <div className="pointer-events-none absolute right-[-15rem] top-[10%] size-[40rem] rounded-full bg-electric/5 blur-[180px]" />

      <div className="lf-container relative z-10">
        <Link
          href={`/events/${event.slug}/tickets`}
          className="group flex w-fit items-center gap-3 font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />

          Back to tickets
        </Link>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_390px] lg:gap-20">
          <div>
            {recoveredCheckout &&
              step !== "complete" && (
                <div className="mb-8 flex max-w-xl flex-wrap items-center justify-between gap-4 border border-electric/25 bg-electric/[0.04] p-4">
                  <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric">
                    Checkout restored from this tab
                  </p>
                  <button
                    type="button"
                    onClick={
                      handleRestartCheckout
                    }
                    className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Start again
                  </button>
                </div>
              )}

            {step ===
              "choice" && (
              <>
                <StepLabel>
                  Checkout / 01
                </StepLabel>

                <CheckoutHeading>
                  How would
                  <br />
                  you like to
                  <br />
                  continue
                  <span className="text-electric">
                    ?
                  </span>
                </CheckoutHeading>

                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearError();
                      setStep(
                        "guest"
                      );
                    }}
                    className="group border border-white/10 p-6 text-left transition-all hover:border-electric/60 hover:bg-electric/[0.03]"
                  >
                    <UserRound className="size-5 text-electric" />

                    <h2 className="font-display mt-10 text-2xl tracking-[-0.04em]">
                      Continue as guest
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      No account
                      required. Your
                      tickets will be
                      delivered to your
                      email after
                      payment.
                    </p>

                    <ArrowRight className="mt-8 size-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  {currentUser ? (
                    <button
                      type="button"
                      onClick={
                        handleRegisteredReservation
                      }
                      disabled={loading}
                      className="group border border-white/10 p-6 text-left transition-all hover:border-electric/60 hover:bg-electric/[0.03] disabled:cursor-wait disabled:opacity-50"
                    >
                      <UserRound className="size-5 text-electric" />

                      <h2 className="font-display mt-10 text-2xl tracking-[-0.04em]">
                        Continue signed in
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Purchasing as{" "}
                        {currentUser.email}.
                        Your tickets will
                        appear in My Tickets.
                      </p>

                      <p className="font-technical mt-8 text-[8px] uppercase tracking-[0.18em] text-electric">
                        {loading
                          ? "Reserving..."
                          : "Use my account"}
                      </p>
                    </button>
                  ) : currentUser === undefined ? (
                    <div className="border border-white/10 p-6 opacity-45">
                      <UserRound className="size-5" />
                      <p className="font-technical mt-10 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                        Checking account...
                      </p>
                    </div>
                  ) : (
                    <Link
                      href={`/login?next=${encodeURIComponent(
                        `/events/${event.slug}/tickets/checkout`
                      )}`}
                      className="group border border-white/10 p-6 text-left transition-all hover:border-electric/60 hover:bg-electric/[0.03]"
                    >
                      <UserRound className="size-5 text-electric" />

                      <h2 className="font-display mt-10 text-2xl tracking-[-0.04em]">
                        Sign in
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Sign in and keep
                        purchases inside My
                        Tickets.
                      </p>

                      <ArrowRight className="mt-8 size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </>
            )}

            {step ===
              "guest" && (
              <>
                <StepLabel>
                  Checkout / Guest
                </StepLabel>

                <CheckoutHeading>
                  Your
                  <br />
                  details
                  <span className="text-electric">
                    .
                  </span>
                </CheckoutHeading>

                <form
                  onSubmit={
                    handleGuestSubmit
                  }
                  className="mt-12 max-w-xl"
                >
                  <div>
                    <label
                      htmlFor="guestName"
                      className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Full name
                    </label>

                    <input
                      id="guestName"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={150}
                      value={
                        guestName
                      }
                      onChange={(
                        changeEvent
                      ) =>
                        setGuestName(
                          changeEvent
                            .target
                            .value
                        )
                      }
                      className="mt-3 h-14 w-full border border-white/10 bg-transparent px-4 outline-none transition-colors focus:border-electric"
                    />
                  </div>

                  <div className="mt-7">
                    <label
                      htmlFor="guestEmail"
                      className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Email address
                    </label>

                    <input
                      id="guestEmail"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={255}
                      value={
                        guestEmail
                      }
                      onChange={(
                        changeEvent
                      ) =>
                        setGuestEmail(
                          changeEvent
                            .target
                            .value
                        )
                      }
                      className="mt-3 h-14 w-full border border-white/10 bg-transparent px-4 outline-none transition-colors focus:border-electric"
                    />

                    <p className="mt-3 text-xs leading-6 text-muted-foreground">
                      This address is
                      used for your
                      order and guest
                      ticket delivery.
                    </p>
                  </div>

                  <ErrorMessage
                    message={error}
                  />

                  <ActionButton
                    loading={loading}
                    label="Reserve tickets"
                    loadingLabel="Reserving..."
                  />
                </form>
              </>
            )}

            {step ===
              "reserved" &&
              reservation && (
                <>
                  <SuccessIcon />

                  <StepLabel className="mt-8">
                    Reservation active
                  </StepLabel>

                  <CheckoutHeading>
                    Your tickets
                    <br />
                    are held
                    <span className="text-electric">
                      .
                    </span>
                  </CheckoutHeading>

                  <p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground">
                    Complete the order
                    before the server
                    reservation expires.
                  </p>

                  <div className="mt-10 max-w-md border border-white/10 p-6">
                    <p className="font-technical text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                      Time remaining
                    </p>

                    <ReservationTimer
                      expiresAt={
                        reservation.expiresAt
                      }
                      onExpire={
                        handleReservationExpired
                      }
                    />
                  </div>

                  {reservationExpired && (
                    <div className="mt-7 max-w-md border border-destructive/30 bg-destructive/5 p-4">
                      <p className="text-sm leading-6 text-destructive">
                        This
                        reservation has
                        expired. Return
                        to ticket
                        selection and
                        create a new
                        reservation.
                      </p>
                      <button
                        type="button"
                        onClick={
                          handleRestartCheckout
                        }
                        className="font-technical mt-5 text-[8px] uppercase tracking-[0.18em] text-foreground"
                      >
                        Start a new checkout
                      </button>
                    </div>
                  )}

                  {checkoutMode ===
                    "registered" &&
                    !reservationExpired && (
                      <div className="mt-7 max-w-md">
                        <label
                          htmlFor="promoCode"
                          className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground"
                        >
                          Promo code / Optional
                        </label>

                        <input
                          id="promoCode"
                          type="text"
                          value={promoCode}
                          onChange={(changeEvent) =>
                            setPromoCode(
                              changeEvent.target.value
                            )
                          }
                          maxLength={80}
                          autoComplete="off"
                          className="mt-3 h-14 w-full border border-white/10 bg-transparent px-4 uppercase outline-none transition-colors focus:border-electric"
                        />

                        <p className="mt-3 text-xs leading-6 text-muted-foreground">
                          The backend validates
                          eligibility and calculates
                          the final discount.
                        </p>
                      </div>
                    )}

                  <ErrorMessage
                    message={error}
                  />

                  <button
                    type="button"
                    onClick={
                      handleCreateOrder
                    }
                    disabled={
                      loading ||
                      reservationExpired
                    }
                    className="group mt-8 flex min-h-14 w-full max-w-md items-center justify-between bg-electric px-5 text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="font-technical text-[10px] uppercase tracking-[0.2em]">
                      {loading
                        ? "Creating order..."
                        : "Create order"}
                    </span>

                    {loading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </>
              )}

            {step ===
              "order" &&
              order && (
                <>
                  <SuccessIcon />

                  <StepLabel className="mt-8">
                    Order created
                  </StepLabel>

                  <CheckoutHeading>
                    Ready for
                    <br />
                    payment
                    <span className="text-electric">
                      .
                    </span>
                  </CheckoutHeading>

                  <p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground">
                    Your order has
                    been created and
                    is pending
                    payment.
                  </p>

                  <div className="mt-10 max-w-md border border-white/10 p-6">
                    <p className="font-technical text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                      Order ID
                    </p>

                    <p className="mt-3 break-all text-sm">
                      {
                        order.orderId
                      }
                    </p>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="font-technical text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                        Status
                      </p>

                      <p className="font-display mt-2 text-xl">
                        {
                          order.status
                        }
                      </p>
                    </div>
                  </div>

                  <ErrorMessage
                    message={error}
                  />

                  <button
                    type="button"
                    onClick={
                      handleInitiatePayment
                    }
                    disabled={
                      loading
                    }
                    className="group mt-8 flex min-h-14 w-full max-w-md items-center justify-between bg-electric px-5 text-background disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="font-technical text-[10px] uppercase tracking-[0.2em]">
                      {loading
                        ? "Starting payment..."
                        : "Continue to payment"}
                    </span>

                    {loading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <CreditCard className="size-4" />
                    )}
                  </button>
                </>
              )}

            {step ===
              "payment" &&
              payment && (
                <>
                  <CreditCard className="size-10 text-electric" />

                  <StepLabel className="mt-8">
                    Mock payment
                  </StepLabel>

                  <CheckoutHeading>
                    Complete
                    <br />
                    payment
                    <span className="text-electric">
                      .
                    </span>
                  </CheckoutHeading>

                  <p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground">
                    This screen uses
                    your backend MOCK
                    payment provider.
                    PayHere will
                    replace this
                    stage later.
                  </p>

                  <div className="mt-10 max-w-md border border-white/10 p-6">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                          Amount
                        </p>

                        <p className="font-display mt-2 text-3xl">
                          {formatMoney(
                            payment.amount,
                            payment.currency
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                          Status
                        </p>

                        <p className="font-display mt-2 text-lg text-electric">
                          {
                            payment.status
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <ErrorMessage
                    message={error}
                  />

                  {payment.status ===
                  "SUCCESS" ? (
                    <button
                      type="button"
                      onClick={
                        handleRecoverTickets
                      }
                      disabled={loading}
                      className="group mt-8 flex min-h-14 w-full max-w-md items-center justify-between bg-electric px-5 text-background disabled:cursor-wait disabled:opacity-50"
                    >
                      <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
                        {loading
                          ? "Retrieving..."
                          : "Open issued tickets"}
                      </span>
                      {loading ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <TicketCheck className="size-4" />
                      )}
                    </button>
                  ) : payment.status ===
                      "FAILED" ||
                    payment.status ===
                      "CANCELLED" ? (
                    <button
                      type="button"
                      onClick={
                        handleRestartCheckout
                      }
                      className="mt-8 flex min-h-14 w-full max-w-md items-center justify-between border border-white/15 px-5"
                    >
                      <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
                        Start again
                      </span>
                      <ArrowRight className="size-4" />
                    </button>
                  ) : (
                    <div className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={
                          handleCompleteMockPayment
                        }
                        disabled={loading}
                        className="group flex min-h-14 flex-1 items-center justify-between bg-electric px-5 text-background disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
                          {loading
                            ? "Processing..."
                            : "Simulate success"}
                        </span>

                        {loading ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleFailMockPayment
                        }
                        disabled={loading}
                        className="flex min-h-14 flex-1 items-center justify-between border border-white/10 px-5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="font-technical text-[9px] uppercase tracking-[0.18em]">
                          Simulate failure
                        </span>

                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                </>
              )}

            {step ===
              "complete" && (
              <>
                <TicketCheck className="size-12 text-electric" />

                <StepLabel className="mt-8">
                  Payment complete
                </StepLabel>

                <CheckoutHeading>
                  You&apos;re
                  <br />
                  in
                  <span className="text-electric">
                    .
                  </span>
                </CheckoutHeading>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-white/10 bg-card/40 p-6 backdrop-blur-xl">
              <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
                Order summary
              </p>

              <h2 className="font-display mt-4 text-3xl tracking-[-0.04em]">
                {event.title}
              </h2>

              <div className="mt-7 border-t border-white/10">
                {selectedTickets.map(
                  ({
                    ticketType,
                    quantity,
                  }) => (
                    <div
                      key={
                        ticketType.id
                      }
                      className="flex items-start justify-between gap-4 border-b border-white/10 py-5"
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
                )}
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                  Total
                </p>

                <p className="font-display text-3xl tracking-[-0.04em]">
                  {formatMoney(
                    totalAmount,
                    totalCurrency
                  )}
                </p>
              </div>

              {reservation && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                    Reservation
                  </p>

                  <p className="mt-2 break-all text-xs text-muted-foreground">
                    {
                      reservation.reservationId
                    }
                  </p>
                </div>
              )}

              {order && (
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="font-technical text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                    Order
                  </p>

                  <p className="mt-2 break-all text-xs text-muted-foreground">
                    {
                      order.orderId
                    }
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

type StepLabelProps = {
  children: React.ReactNode;
  className?: string;
};

function StepLabel({
  children,
  className = "",
}: StepLabelProps) {
  return (
    <p
      className={`font-technical text-[10px] uppercase tracking-[0.28em] text-electric ${className}`}
    >
      {children}
    </p>
  );
}

type CheckoutHeadingProps = {
  children: React.ReactNode;
};

function CheckoutHeading({
  children,
}: CheckoutHeadingProps) {
  return (
    <h1 className="font-display mt-6 text-[clamp(3.8rem,9vw,8rem)] leading-[0.78] tracking-[-0.07em]">
      {children}
    </h1>
  );
}

function SuccessIcon() {
  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-electric text-background">
      <Check className="size-5" />
    </div>
  );
}

type ErrorMessageProps = {
  message: string | null;
};

function ErrorMessage({
  message,
}: ErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="mt-7 max-w-xl border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm leading-6 text-destructive">
        {message}
      </p>
    </div>
  );
}

type ActionButtonProps = {
  loading: boolean;
  label: string;
  loadingLabel: string;
};

function ActionButton({
  loading,
  label,
  loadingLabel,
}: ActionButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group mt-8 flex min-h-14 w-full items-center justify-between bg-electric px-5 text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="font-technical text-[10px] uppercase tracking-[0.2em]">
        {loading
          ? loadingLabel
          : label}
      </span>

      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
}
