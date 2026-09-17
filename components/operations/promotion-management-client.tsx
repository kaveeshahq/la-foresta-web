"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgePercent,
  CalendarClock,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  ShieldAlert,
} from "lucide-react";
import {
  type FormEvent,
  type InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/api/auth";
import { getAdminEvents } from "@/lib/api/event-management";
import {
  createPromoCode,
  getAdminPromoCodes,
  PromotionApiError,
  updatePromoCode,
  updatePromoCodeStatus,
} from "@/lib/api/promotions";
import { formatMoney } from "@/lib/formatters";
import type { CurrentUser } from "@/types/auth";
import type { Event } from "@/types/events";
import type {
  AdminPromoCode,
  DiscountType,
  SavePromoCodePayload,
} from "@/types/promotions";

const PROMOTION_ROLES = new Set([
  "EVENT_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
]);

type PromotionForm = {
  eventId: string;
  code: string;
  discountType: DiscountType;
  discountValue: string;
  minimumOrderAmount: string;
  usageLimit: string;
  perUserLimit: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
};

const emptyForm: PromotionForm = {
  eventId: "",
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minimumOrderAmount: "",
  usageLimit: "",
  perUserLimit: "",
  validFrom: "",
  validUntil: "",
  active: true,
};

function toDateTimeInput(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 16);
}

function promotionToForm(
  promotion: AdminPromoCode
): PromotionForm {
  return {
    eventId: promotion.eventId ?? "",
    code: promotion.code,
    discountType: promotion.discountType,
    discountValue: String(promotion.discountValue),
    minimumOrderAmount:
      promotion.minimumOrderAmount === null
        ? ""
        : String(promotion.minimumOrderAmount),
    usageLimit:
      promotion.usageLimit === null
        ? ""
        : String(promotion.usageLimit),
    perUserLimit:
      promotion.perUserLimit === null
        ? ""
        : String(promotion.perUserLimit),
    validFrom: toDateTimeInput(promotion.validFrom),
    validUntil: toDateTimeInput(promotion.validUntil),
    active: promotion.active,
  };
}

function nullableNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

function promotionState(promotion: AdminPromoCode) {
  const now = Date.now();

  if (!promotion.active) return "Paused";
  if (
    promotion.validFrom &&
    new Date(promotion.validFrom).getTime() > now
  ) {
    return "Scheduled";
  }
  if (
    promotion.validUntil &&
    new Date(promotion.validUntil).getTime() < now
  ) {
    return "Expired";
  }
  if (
    promotion.remainingUses !== null &&
    promotion.remainingUses <= 0
  ) {
    return "Exhausted";
  }

  return "Live";
}

function formatDateTime(value: string | null) {
  if (!value) return "Open";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  }).format(new Date(value));
}

export function PromotionManagementClient() {
  const router = useRouter();
  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [promotions, setPromotions] = useState<
    AdminPromoCode[] | null
  >(null);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [form, setForm] = useState<PromotionForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const authorized = Boolean(
    user?.roles.some((role) => PROMOTION_ROLES.has(role))
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!active) return;
        setUser(currentUser);

        if (
          !currentUser.roles.some((role) =>
            PROMOTION_ROLES.has(role)
          )
        ) {
          setPromotions([]);
          setEvents([]);
          return;
        }

        const [promoCodes, adminEvents] = await Promise.all([
          getAdminPromoCodes(),
          getAdminEvents(),
        ]);

        if (active) {
          setPromotions(promoCodes);
          setEvents(adminEvents);
        }
      } catch (caught) {
        if (!active) return;

        if (
          caught instanceof Error &&
          "status" in caught &&
          caught.status === 401
        ) {
          router.replace(
            "/login?next=/operations/promotions"
          );
          return;
        }

        setUser((current) => current ?? null);
        setPromotions([]);
        setEvents([]);
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load promotions."
        );
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [router]);

  const metrics = useMemo(() => {
    const current = promotions ?? [];

    return {
      live: current.filter(
        (promotion) => promotionState(promotion) === "Live"
      ).length,
      redemptions: current.reduce(
        (total, promotion) =>
          total + promotion.redemptionCount,
        0
      ),
      total: current.length,
    };
  }, [promotions]);

  const handleError = (caught: unknown, fallback: string) => {
    if (
      caught instanceof PromotionApiError &&
      caught.status === 401
    ) {
      router.replace("/login?next=/operations/promotions");
      return;
    }

    setError(caught instanceof Error ? caught.message : fallback);
  };

  const replacePromotion = (promotion: AdminPromoCode) => {
    setPromotions((current) =>
      (current ?? []).map((item) =>
        item.id === promotion.id ? promotion : item
      )
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const beginEdit = (promotion: AdminPromoCode) => {
    setEditingId(promotion.id);
    setForm(promotionToForm(promotion));
    setError(null);
    setNotice(null);

    window.requestAnimationFrame(() => {
      document
        .getElementById("promotion-editor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const submit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    setError(null);
    setNotice(null);

    const discountValue = Number(form.discountValue);

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      setError("Discount value must be greater than zero.");
      return;
    }

    if (
      form.discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      setError("Percentage discounts cannot exceed 100%.");
      return;
    }

    if (
      form.validFrom &&
      form.validUntil &&
      new Date(form.validUntil) <= new Date(form.validFrom)
    ) {
      setError("The end of the campaign must be after its start.");
      return;
    }

    const payload: SavePromoCodePayload = {
      eventId: form.eventId || null,
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue,
      minimumOrderAmount: nullableNumber(
        form.minimumOrderAmount
      ),
      usageLimit: nullableNumber(form.usageLimit),
      perUserLimit: nullableNumber(form.perUserLimit),
      validFrom: form.validFrom
        ? new Date(form.validFrom).toISOString()
        : null,
      validUntil: form.validUntil
        ? new Date(form.validUntil).toISOString()
        : null,
      active: form.active,
    };

    setBusy("save");

    try {
      if (editingId) {
        const updated = await updatePromoCode(editingId, payload);
        replacePromotion(updated);
        setNotice(`${updated.code} was updated.`);
      } else {
        const created = await createPromoCode(payload);
        setPromotions((current) => [created, ...(current ?? [])]);
        setNotice(`${created.code} is ready.`);
      }

      setEditingId(null);
      setForm(emptyForm);
    } catch (caught) {
      handleError(caught, "Unable to save the promo code.");
    } finally {
      setBusy(null);
    }
  };

  const toggleStatus = async (promotion: AdminPromoCode) => {
    const nextActive = !promotion.active;
    setBusy(`status:${promotion.id}`);
    setError(null);
    setNotice(null);

    try {
      const updated = await updatePromoCodeStatus(
        promotion.id,
        nextActive
      );
      replacePromotion(updated);
      setNotice(
        `${updated.code} was ${
          updated.active ? "activated" : "paused"
        }.`
      );
    } catch (caught) {
      handleError(caught, "Unable to change the promo status.");
    } finally {
      setBusy(null);
    }
  };

  if (user === undefined || promotions === null || events === null) {
    return <Loading label="Opening promotion controls" />;
  }

  if (!authorized) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
        <ShieldAlert className="size-9 text-destructive" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          Promotion access required.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Promotion controls are restricted to event managers and
          administrators.
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
      <section className="grid border border-white/10 bg-card/40 sm:grid-cols-3">
        <Metric label="Campaigns" value={String(metrics.total)} />
        <Metric label="Live now" value={String(metrics.live)} />
        <Metric
          label="Paid redemptions"
          value={String(metrics.redemptions)}
        />
      </section>

      {(error || notice) && (
        <div
          className={`border p-4 text-sm leading-6 ${
            error
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-electric/25 bg-electric/[0.035] text-electric"
          }`}
        >
          {error ?? notice}
        </div>
      )}

      <section className="border border-white/10 bg-card/40 p-5 sm:p-6">
        <PanelHeading
          number="01"
          title="Campaign register"
          description="Redemption figures count paid orders. Pausing a campaign blocks future use without changing previous orders."
          icon={<BadgePercent className="size-4" />}
        />

        {promotions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-display text-2xl tracking-[-0.04em]">
              No campaigns yet.
            </p>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Create the first offer using the campaign editor below.
            </p>
          </div>
        ) : (
          <div className="mt-2 divide-y divide-white/10">
            {promotions.map((promotion) => {
              const state = promotionState(promotion);
              const statusBusy =
                busy === `status:${promotion.id}`;

              return (
                <article
                  key={promotion.id}
                  className="grid gap-5 py-6 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-2xl tracking-[-0.04em]">
                        {promotion.code}
                      </h3>
                      <span
                        className={`border px-2 py-1 font-technical text-[7px] uppercase tracking-[0.14em] ${
                          state === "Live"
                            ? "border-electric/30 text-electric"
                            : "border-white/15 text-muted-foreground"
                        }`}
                      >
                        {state}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {promotion.eventTitle ?? "All events"}
                    </p>
                    <p className="font-technical mt-4 text-[8px] uppercase tracking-[0.16em] text-foreground">
                      {promotion.discountType === "PERCENTAGE"
                        ? `${promotion.discountValue}% off`
                        : `${formatMoney(
                            promotion.discountValue,
                            "LKR"
                          )} off`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <Detail
                      label="Redemptions"
                      value={`${promotion.redemptionCount}${
                        promotion.usageLimit === null
                          ? " / Unlimited"
                          : ` / ${promotion.usageLimit}`
                      }`}
                    />
                    <Detail
                      label="Per account"
                      value={
                        promotion.perUserLimit === null
                          ? "Unlimited"
                          : String(promotion.perUserLimit)
                      }
                    />
                    <Detail
                      label="Starts"
                      value={formatDateTime(promotion.validFrom)}
                    />
                    <Detail
                      label="Ends"
                      value={formatDateTime(promotion.validUntil)}
                    />
                  </div>

                  <div className="flex gap-2 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => beginEdit(promotion)}
                      className="flex size-11 items-center justify-center border border-white/10 transition-colors hover:border-electric hover:text-electric"
                      aria-label={`Edit ${promotion.code}`}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleStatus(promotion)}
                      disabled={statusBusy}
                      className={`flex size-11 items-center justify-center border transition-colors disabled:cursor-wait disabled:opacity-50 ${
                        promotion.active
                          ? "border-white/10 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                          : "border-electric/30 text-electric hover:bg-electric hover:text-background"
                      }`}
                      aria-label={`${
                        promotion.active ? "Pause" : "Activate"
                      } ${promotion.code}`}
                    >
                      {statusBusy ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Power className="size-4" />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <form
        id="promotion-editor"
        onSubmit={submit}
        className="scroll-mt-28 border border-white/10 bg-card/40 p-5 sm:p-6"
      >
        <PanelHeading
          number="02"
          title={editingId ? "Edit campaign" : "New campaign"}
          description={
            editingId
              ? "Changes apply to future order attempts only."
              : "Leave event blank to make the code available across all events."
          }
          icon={<CalendarClock className="size-4" />}
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label="Promo code"
            required
            maxLength={50}
            value={form.code}
            onChange={(event) =>
              setForm({
                ...form,
                code: event.target.value.toUpperCase(),
              })
            }
            placeholder="ECLIPSE20"
          />

          <SelectField
            label="Event scope"
            value={form.eventId}
            onChange={(value) =>
              setForm({ ...form, eventId: value })
            }
          >
            <option value="">All events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Discount type"
            value={form.discountType}
            onChange={(value) =>
              setForm({
                ...form,
                discountType: value as DiscountType,
              })
            }
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed amount</option>
          </SelectField>

          <Field
            label={
              form.discountType === "PERCENTAGE"
                ? "Discount percentage"
                : "Discount amount / LKR"
            }
            required
            type="number"
            min="0.01"
            max={
              form.discountType === "PERCENTAGE"
                ? "100"
                : undefined
            }
            step="0.01"
            value={form.discountValue}
            onChange={(event) =>
              setForm({
                ...form,
                discountValue: event.target.value,
              })
            }
          />

          <Field
            label="Minimum order / LKR"
            type="number"
            min="0"
            step="0.01"
            value={form.minimumOrderAmount}
            onChange={(event) =>
              setForm({
                ...form,
                minimumOrderAmount: event.target.value,
              })
            }
            placeholder="Optional"
          />

          <Field
            label="Total usage limit"
            type="number"
            min="1"
            step="1"
            value={form.usageLimit}
            onChange={(event) =>
              setForm({ ...form, usageLimit: event.target.value })
            }
            placeholder="Unlimited"
          />

          <Field
            label="Limit per account"
            type="number"
            min="1"
            step="1"
            value={form.perUserLimit}
            onChange={(event) =>
              setForm({
                ...form,
                perUserLimit: event.target.value,
              })
            }
            placeholder="Unlimited"
          />

          <div className="hidden sm:block" />

          <Field
            label="Valid from"
            type="datetime-local"
            value={form.validFrom}
            onChange={(event) =>
              setForm({ ...form, validFrom: event.target.value })
            }
          />

          <Field
            label="Valid until"
            type="datetime-local"
            value={form.validUntil}
            onChange={(event) =>
              setForm({ ...form, validUntil: event.target.value })
            }
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 border border-white/10 p-4">
          <span>
            <span className="block text-sm">
              Accept this code at checkout
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Date windows and redemption limits still apply while active.
            </span>
          </span>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) =>
              setForm({ ...form, active: event.target.checked })
            }
            className="size-5 accent-[var(--electric)]"
          />
        </label>

        <button
          type="submit"
          disabled={busy === "save"}
          className="mt-6 flex min-h-12 w-full items-center justify-between border border-electric/35 px-4 text-electric transition-colors hover:bg-electric hover:text-background disabled:cursor-wait disabled:opacity-50"
        >
          <span className="font-technical text-[8px] uppercase tracking-[0.18em]">
            {busy === "save"
              ? "Saving..."
              : editingId
                ? "Save campaign changes"
                : "Create campaign"}
          </span>
          {busy === "save" ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={busy === "save"}
            className="mt-3 min-h-11 w-full border border-white/10 font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Cancel editing
          </button>
        )}
      </form>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6">
      <p className="font-technical text-[7px] uppercase tracking-[0.17em] text-muted-foreground">
        {label}
      </p>
      <p className="font-display mt-3 text-3xl tracking-[-0.05em]">
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-technical text-[7px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 leading-5">{value}</p>
    </div>
  );
}

function PanelHeading({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
      <div>
        <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric">
          {number} / {title}
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="text-electric">{icon}</span>
    </div>
  );
}

function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 h-12 w-full border border-white/10 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-electric"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full border border-white/10 bg-background px-3 text-sm outline-none transition-colors focus:border-electric"
      >
        {children}
      </select>
    </label>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <div className="border border-white/10 bg-card/40 p-6">
      <LoaderCircle className="size-5 animate-spin text-electric" />
      <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
