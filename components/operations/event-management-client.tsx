"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Send,
  ShieldAlert,
  Ticket,
} from "lucide-react";
import {
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/lib/api/auth";
import {
  createEvent,
  createTicketType,
  createVenue,
  EventManagementApiError,
  getAdminEvents,
  getAdminTicketTypes,
  getAdminVenues,
  publishEvent,
  updateEvent,
  updateTicketType,
} from "@/lib/api/event-management";
import { formatMoney } from "@/lib/formatters";
import type { CurrentUser } from "@/types/auth";
import type { Event } from "@/types/events";
import type { Venue } from "@/types/event-management";
import type { TicketType } from "@/types/ticket-type";

const EVENT_ROLES = new Set([
  "EVENT_MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
]);

type EventForm = {
  venueId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  startsAt: string;
  endsAt: string;
  salesStartAt: string;
  salesEndAt: string;
  minimumAge: string;
};

const emptyEventForm: EventForm = {
  venueId: "",
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  startsAt: "",
  endsAt: "",
  salesStartAt: "",
  salesEndAt: "",
  minimumAge: "18",
};

function toDateTimeInput(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 16);
}

function eventToForm(event: Event): EventForm {
  return {
    venueId: event.venueId ?? "",
    title: event.title,
    slug: event.slug,
    shortDescription: event.shortDescription ?? "",
    description: event.description ?? "",
    startsAt: toDateTimeInput(event.startsAt),
    endsAt: toDateTimeInput(event.endsAt),
    salesStartAt: toDateTimeInput(event.salesStartAt),
    salesEndAt: toDateTimeInput(event.salesEndAt),
    minimumAge: String(event.minimumAge),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function EventManagementClient() {
  const router = useRouter();
  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [venues, setVenues] = useState<Venue[] | null>(null);
  const [workingEvent, setWorkingEvent] =
    useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [eventForm, setEventForm] =
    useState<EventForm>(emptyEventForm);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const authorized = Boolean(
    user?.roles.some((role) => EVENT_ROLES.has(role))
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!active) return;

        setUser(currentUser);

        const hasAccess = currentUser.roles.some((role) =>
          EVENT_ROLES.has(role)
        );

        if (!hasAccess) {
          setEvents([]);
          setVenues([]);
          return;
        }

        const [adminEvents, adminVenues] = await Promise.all([
          getAdminEvents(),
          getAdminVenues(),
        ]);

        if (active) {
          setEvents(adminEvents);
          setVenues(adminVenues);
          setEventForm((current) => ({
            ...current,
            venueId: current.venueId || adminVenues[0]?.id || "",
          }));
        }
      } catch (caught) {
        if (!active) return;

        if (
          caught instanceof Error &&
          "status" in caught &&
          caught.status === 401
        ) {
          router.replace("/login?next=/operations/events");
          return;
        }

        setUser((current) => current ?? null);
        setEvents([]);
        setVenues([]);
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load event management."
        );
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [router]);

  const handleError = (caught: unknown, fallback: string) => {
    if (
      caught instanceof EventManagementApiError &&
      caught.status === 401
    ) {
      router.replace("/login?next=/operations/events");
      return;
    }

    setError(caught instanceof Error ? caught.message : fallback);
  };

  const beginNewEvent = () => {
    setWorkingEvent(null);
    setTicketTypes([]);
    setEventForm({
      ...emptyEventForm,
      venueId: venues?.[0]?.id ?? "",
    });
    setError(null);
    setNotice(null);
  };

  const manageEvent = async (event: Event) => {
    setWorkingEvent(event);
    setEventForm(eventToForm(event));
    setTicketTypes([]);
    setError(null);
    setNotice(null);
    setBusy("tickets");

    try {
      setTicketTypes(await getAdminTicketTypes(event.id));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load ticket types."
      );
    } finally {
      setBusy(null);
    }
  };

  if (
    user === undefined ||
    events === null ||
    venues === null
  ) {
    return <Loading label="Opening event studio" />;
  }

  if (!authorized) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
        <ShieldAlert className="size-9 text-destructive" />
        <h2 className="font-display mt-8 text-3xl tracking-[-0.04em]">
          Event access required.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Event Studio is restricted to event managers and administrators.
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

  return (
    <div className="space-y-5">
      {error && (
        <div className="border border-destructive/30 bg-destructive/5 p-5 text-sm leading-6 text-destructive">
          {error}
        </div>
      )}

      {notice && (
        <div className="flex gap-3 border border-electric/30 bg-electric/[0.04] p-5 text-sm text-electric">
          <Check className="size-5 shrink-0" />
          {notice}
        </div>
      )}

      <PublishedEvents
        events={events}
        onManage={(event) => void manageEvent(event)}
        onNew={beginNewEvent}
      />

      <VenueForm
        busy={busy === "venue"}
        onCreated={(venue) => {
          setVenues((current) =>
            [...(current ?? []), venue].sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          );
          setEventForm((current) => ({
            ...current,
            venueId: venue.id,
          }));
          setNotice(`${venue.name} created and selected for the event.`);
        }}
        onBusy={setBusy}
        onError={handleError}
      />

      <EventFormPanel
        form={eventForm}
        event={workingEvent}
        venues={venues}
        busy={busy === "event"}
        onChange={setEventForm}
        onBusy={setBusy}
        onError={handleError}
        onSaved={(event) => {
          setWorkingEvent(event);
          setEventForm(eventToForm(event));
          setNotice(
            event.status === "DRAFT"
              ? "Draft saved. Add at least one ticket type before publishing."
              : "Event details updated."
          );
          setEvents((current) => {
            const withoutEvent = (current ?? []).filter(
              (item) => item.id !== event.id
            );
            return [event, ...withoutEvent];
          });
        }}
      />

      {workingEvent && (
        <TicketTypePanel
          key={workingEvent.id}
          event={workingEvent}
          ticketTypes={ticketTypes}
          loading={busy === "tickets"}
          onBusy={setBusy}
          onError={handleError}
          onCreated={(ticketType) => {
            setTicketTypes((current) => [...current, ticketType]);
            setNotice(`${ticketType.name} inventory created.`);
          }}
          onUpdated={(ticketType) => {
            setTicketTypes((current) =>
              current.map((item) =>
                item.id === ticketType.id ? ticketType : item
              )
            );
            setNotice(`${ticketType.name} updated.`);
          }}
        />
      )}

      {workingEvent?.status === "DRAFT" && (
        <PublishPanel
          event={workingEvent}
          hasTicketTypes={ticketTypes.length > 0}
          busy={busy === "publish"}
          onBusy={setBusy}
          onError={handleError}
          onPublished={(event) => {
            setWorkingEvent(event);
            setEventForm(eventToForm(event));
            setEvents((current) => {
              const withoutEvent = (current ?? []).filter(
                (item) => item.id !== event.id
              );
              return [...withoutEvent, event].sort((a, b) =>
                a.startsAt.localeCompare(b.startsAt)
              );
            });
            setNotice("Event published and now visible on the public site.");
          }}
        />
      )}
    </div>
  );
}

function PublishedEvents({
  events,
  onManage,
  onNew,
}: {
  events: Event[];
  onManage: (event: Event) => void;
  onNew: () => void;
}) {
  return (
    <section className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
            All events
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {events.length} across every status
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2 border border-electric/30 px-4 py-3 text-electric"
        >
          <Plus className="size-4" />
          <span className="font-technical text-[8px] uppercase tracking-[0.16em]">
            New event
          </span>
        </button>
      </div>

      {events.length ? (
        <div>
          {events.map((event) => (
            <div
              key={event.id}
              className="grid gap-4 border-b border-white/10 py-5 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-xl tracking-[-0.03em]">
                    {event.title}
                  </p>
                  <span className="border border-white/15 px-2 py-1 font-technical text-[7px] uppercase tracking-[0.14em] text-electric">
                    {event.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {event.venueName ?? "Venue pending"} /{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeZone: "Asia/Colombo",
                  }).format(new Date(event.startsAt))}
                </p>
              </div>
              <div className="flex gap-2">
                {event.status === "PUBLISHED" && (
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex size-11 items-center justify-center border border-white/10 transition-colors hover:border-electric hover:text-electric"
                    aria-label={`View ${event.title}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => onManage(event)}
                  className="border border-white/10 px-4 font-technical text-[8px] uppercase tracking-[0.16em] transition-colors hover:border-electric"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-sm text-muted-foreground">
          No events yet. Start by creating or selecting a venue below.
        </p>
      )}
    </section>
  );
}

function VenueForm({
  busy,
  onCreated,
  onBusy,
  onError,
}: {
  busy: boolean;
  onCreated: (venue: Venue) => void;
  onBusy: (value: string | null) => void;
  onError: (error: unknown, fallback: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "Sri Lanka",
    latitude: "",
    longitude: "",
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onBusy("venue");

    try {
      const venue = await createVenue({
        name: form.name.trim(),
        addressLine1: form.addressLine1.trim() || null,
        addressLine2: form.addressLine2.trim() || null,
        city: form.city.trim() || null,
        country: form.country.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      onCreated(venue);
      setForm((current) => ({ ...current, name: "", addressLine1: "", addressLine2: "", city: "", latitude: "", longitude: "" }));
    } catch (caught) {
      onError(caught, "Unable to create the venue.");
    } finally {
      onBusy(null);
    }
  };

  return (
    <form onSubmit={submit} className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <PanelHeading icon={<MapPin className="size-4" />} number="01" title="Create venue" description="Skip this step when the venue already appears in the event form." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Venue name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={150} />
        <Field label="Country" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} maxLength={100} />
        <Field label="Address line 1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} maxLength={255} />
        <Field label="Address line 2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} maxLength={255} />
        <Field label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} maxLength={100} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          <Field label="Longitude" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
        </div>
      </div>
      <SubmitButton busy={busy} label="Create and select venue" />
    </form>
  );
}

function EventFormPanel({
  form,
  event,
  venues,
  busy,
  onChange,
  onBusy,
  onError,
  onSaved,
}: {
  form: EventForm;
  event: Event | null;
  venues: Venue[];
  busy: boolean;
  onChange: (value: EventForm) => void;
  onBusy: (value: string | null) => void;
  onError: (error: unknown, fallback: string) => void;
  onSaved: (event: Event) => void;
}) {
  const submit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    onBusy("event");

    const dateOrNull = (value: string) =>
      value ? new Date(value).toISOString() : null;

    const payload = {
      venueId: form.venueId.trim(),
      title: form.title.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim() || null,
      description: form.description.trim() || null,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: dateOrNull(form.endsAt),
      salesStartAt: dateOrNull(form.salesStartAt),
      salesEndAt: dateOrNull(form.salesEndAt),
      minimumAge: Number(form.minimumAge),
    };

    try {
      onSaved(
        event
          ? await updateEvent(event.id, payload)
          : await createEvent(payload)
      );
    } catch (caught) {
      onError(caught, "Unable to save the event.");
    } finally {
      onBusy(null);
    }
  };

  return (
    <form onSubmit={submit} className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <PanelHeading icon={<CalendarDays className="size-4" />} number="02" title={event ? "Event details" : "Create event"} description={event ? `${event.status} / ${event.id}` : "New events begin as drafts."} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">
            Venue
          </span>
          <select
            required
            value={form.venueId}
            onChange={(changeEvent) =>
              onChange({
                ...form,
                venueId: changeEvent.target.value,
              })
            }
            className="mt-2 h-12 w-full border border-white/10 bg-background px-3 text-sm outline-none transition-colors focus:border-electric"
          >
            <option value="" disabled>
              Select a venue
            </option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
                {venue.city ? ` / ${venue.city}` : ""}
              </option>
            ))}
          </select>
        </label>
        <Field label="Minimum age" required type="number" min="0" value={form.minimumAge} onChange={(e) => onChange({ ...form, minimumAge: e.target.value })} />
        <Field label="Event title" required value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value, slug: form.slug ? form.slug : slugify(e.target.value) })} maxLength={200} />
        <Field label="URL slug" required value={form.slug} onChange={(e) => onChange({ ...form, slug: slugify(e.target.value) })} maxLength={220} />
        <Field label="Starts at" required type="datetime-local" value={form.startsAt} onChange={(e) => onChange({ ...form, startsAt: e.target.value })} />
        <Field label="Ends at" type="datetime-local" value={form.endsAt} onChange={(e) => onChange({ ...form, endsAt: e.target.value })} />
        <Field label="Sales start" type="datetime-local" value={form.salesStartAt} onChange={(e) => onChange({ ...form, salesStartAt: e.target.value })} />
        <Field label="Sales end" type="datetime-local" value={form.salesEndAt} onChange={(e) => onChange({ ...form, salesEndAt: e.target.value })} />
      </div>
      <div className="mt-4 space-y-4">
        <TextArea label="Short description" value={form.shortDescription} onChange={(e) => onChange({ ...form, shortDescription: e.target.value })} maxLength={500} rows={3} />
        <TextArea label="Full description" value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} rows={6} />
      </div>
      <SubmitButton busy={busy} label={event ? "Save event changes" : "Create draft event"} />
    </form>
  );
}

function TicketTypePanel({
  event,
  ticketTypes,
  loading,
  onBusy,
  onError,
  onCreated,
  onUpdated,
}: {
  event: Event;
  ticketTypes: TicketType[];
  loading: boolean;
  onBusy: (value: string | null) => void;
  onError: (error: unknown, fallback: string) => void;
  onCreated: (ticketType: TicketType) => void;
  onUpdated: (ticketType: TicketType) => void;
}) {
  const emptyForm = {
    name: "",
    description: "",
    price: "",
    currency: "LKR",
    capacity: "",
    maxPerOrder: "4",
    salesStartAt: "",
    salesEndAt: "",
    active: true,
  };
  const [form, setForm] = useState(emptyForm);
  const [editingTicketTypeId, setEditingTicketTypeId] =
    useState<string | null>(null);

  const resetForm = () => {
    setEditingTicketTypeId(null);
    setForm(emptyForm);
  };

  const beginEdit = (ticketType: TicketType) => {
    setEditingTicketTypeId(ticketType.id);
    setForm({
      name: ticketType.name,
      description: ticketType.description ?? "",
      price: String(ticketType.price),
      currency: ticketType.currency,
      capacity: String(ticketType.capacity),
      maxPerOrder: String(ticketType.maxPerOrder),
      salesStartAt: toDateTimeInput(ticketType.salesStartAt),
      salesEndAt: toDateTimeInput(ticketType.salesEndAt),
      active: ticketType.active,
    });
  };

  const submit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    onBusy("tickets");

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        currency: form.currency.trim().toUpperCase(),
        capacity: Number(form.capacity),
        maxPerOrder: Number(form.maxPerOrder),
        salesStartAt: form.salesStartAt ? new Date(form.salesStartAt).toISOString() : null,
        salesEndAt: form.salesEndAt ? new Date(form.salesEndAt).toISOString() : null,
      };

      if (editingTicketTypeId) {
        onUpdated(
          await updateTicketType(
            event.id,
            editingTicketTypeId,
            {
              ...payload,
              active: form.active,
            }
          )
        );
      } else {
        onCreated(
          await createTicketType(event.id, payload)
        );
      }

      resetForm();
    } catch (caught) {
      onError(caught, "Unable to create the ticket type.");
    } finally {
      onBusy(null);
    }
  };

  return (
    <form onSubmit={submit} className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <PanelHeading icon={<Ticket className="size-4" />} number="03" title="Ticket inventory" description={editingTicketTypeId ? "Editing an existing admission type." : `Add admission types for ${event.title}.`} />
      {ticketTypes.length > 0 && (
        <div className="mt-6 border-y border-white/10">
          {ticketTypes.map((ticketType) => (
            <div key={ticketType.id} className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-0">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm">{ticketType.name}</p>
                  <span className={`border px-2 py-1 font-technical text-[7px] uppercase tracking-[0.13em] ${ticketType.active ? "border-electric/25 text-electric" : "border-white/15 text-muted-foreground"}`}>
                    {ticketType.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="font-technical mt-1 text-[7px] uppercase tracking-[0.14em] text-muted-foreground">Capacity {ticketType.capacity} / Max {ticketType.maxPerOrder}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl">{formatMoney(ticketType.price, ticketType.currency)}</p>
                <button
                  type="button"
                  onClick={() => beginEdit(ticketType)}
                  className="flex size-10 items-center justify-center border border-white/10 transition-colors hover:border-electric hover:text-electric"
                  aria-label={`Edit ${ticketType.name}`}
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Ticket name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={150} />
        <Field label="Currency" required minLength={3} maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
        <Field label="Price" required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <Field label="Capacity" required type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <Field label="Maximum per order" required type="number" min="1" value={form.maxPerOrder} onChange={(e) => setForm({ ...form, maxPerOrder: e.target.value })} />
        <div />
        <Field label="Ticket sales start" type="datetime-local" value={form.salesStartAt} onChange={(e) => setForm({ ...form, salesStartAt: e.target.value })} />
        <Field label="Ticket sales end" type="datetime-local" value={form.salesEndAt} onChange={(e) => setForm({ ...form, salesEndAt: e.target.value })} />
      </div>
      <div className="mt-4">
        <TextArea label="Ticket description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} rows={3} />
      </div>
      {editingTicketTypeId && (
        <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 border border-white/10 p-4">
          <span>
            <span className="block text-sm">Available for new reservations</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Turning this off hides the ticket type and blocks new reservations.
            </span>
          </span>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(changeEvent) =>
              setForm({
                ...form,
                active: changeEvent.target.checked,
              })
            }
            className="size-5 accent-[var(--electric)]"
          />
        </label>
      )}
      <SubmitButton busy={loading} label={editingTicketTypeId ? "Save ticket changes" : "Add ticket type"} />
      {editingTicketTypeId && (
        <button
          type="button"
          onClick={resetForm}
          disabled={loading}
          className="mt-3 min-h-11 w-full border border-white/10 font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          Cancel editing
        </button>
      )}
    </form>
  );
}

function PublishPanel({ event, hasTicketTypes, busy, onBusy, onError, onPublished }: { event: Event; hasTicketTypes: boolean; busy: boolean; onBusy: (value: string | null) => void; onError: (error: unknown, fallback: string) => void; onPublished: (event: Event) => void }) {
  const submit = async () => {
    if (!window.confirm(`Publish ${event.title}? It will become visible to customers immediately.`)) return;
    onBusy("publish");
    try {
      onPublished(await publishEvent(event.id));
    } catch (caught) {
      onError(caught, "Unable to publish the event.");
    } finally {
      onBusy(null);
    }
  };

  return (
    <section className="border border-electric/30 bg-electric/[0.035] p-5 sm:p-6">
      <PanelHeading icon={<Send className="size-4" />} number="04" title="Publish event" description="Publishing makes the event and its active tickets visible on the public site." />
      <button type="button" onClick={() => void submit()} disabled={busy || !hasTicketTypes} className="mt-6 flex min-h-14 w-full items-center justify-between bg-electric px-5 text-background disabled:cursor-not-allowed disabled:opacity-35">
        <span className="font-technical text-[9px] uppercase tracking-[0.18em]">{busy ? "Publishing..." : hasTicketTypes ? "Publish to the public site" : "Add a ticket type first"}</span>
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
      </button>
    </section>
  );
}

function PanelHeading({ icon, number, title, description }: { icon: React.ReactNode; number: string; title: string; description: string }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
      <div>
        <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric">{number} / {title}</p>
        <p className="mt-2 break-all text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <span className="text-electric">{icon}</span>
    </div>
  );
}

function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <input {...props} className="mt-2 h-12 w-full border border-white/10 bg-transparent px-3 text-sm outline-none transition-colors focus:border-electric" />
    </label>
  );
}

function TextArea({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="font-technical text-[7px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <textarea {...props} className="mt-2 w-full resize-y border border-white/10 bg-transparent p-3 text-sm leading-6 outline-none transition-colors focus:border-electric" />
    </label>
  );
}

function SubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button type="submit" disabled={busy} className="mt-6 flex min-h-12 w-full items-center justify-between border border-electric/35 px-4 text-electric transition-colors hover:bg-electric hover:text-background disabled:cursor-wait disabled:opacity-50">
      <span className="font-technical text-[8px] uppercase tracking-[0.18em]">{busy ? "Saving..." : label}</span>
      {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
    </button>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <div className="border border-white/10 bg-card/40 p-6">
      <LoaderCircle className="size-5 animate-spin text-electric" />
      <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}
