import type { Event } from "@/types/events";
import type {
  CreateTicketTypePayload,
  CreateVenuePayload,
  SaveEventPayload,
  UpdateTicketTypePayload,
  Venue,
} from "@/types/event-management";
import type { TicketType } from "@/types/ticket-type";

export class EventManagementApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "EventManagementApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit,
  fallback: string
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new EventManagementApiError(
      "The event service is temporarily unavailable.",
      503
    );
  }

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    // An empty error response is handled by the fallback below.
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : fallback;

    throw new EventManagementApiError(
      message,
      response.status
    );
  }

  return body as T;
}

export function createVenue(
  payload: CreateVenuePayload
) {
  return request<Venue>(
    "/api/staff/venues",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Unable to create the venue."
  );
}

export function getAdminVenues() {
  return request<Venue[]>(
    "/api/staff/venues",
    { method: "GET", cache: "no-store" },
    "Unable to load venues."
  );
}

export function getAdminEvents() {
  return request<Event[]>(
    "/api/staff/events",
    { method: "GET", cache: "no-store" },
    "Unable to load events."
  );
}

export function createEvent(
  payload: SaveEventPayload
) {
  return request<Event>(
    "/api/staff/events",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Unable to create the event."
  );
}

export function updateEvent(
  eventId: string,
  payload: SaveEventPayload
) {
  return request<Event>(
    `/api/staff/events/${encodeURIComponent(eventId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Unable to update the event."
  );
}

export function publishEvent(eventId: string) {
  return request<Event>(
    `/api/staff/events/${encodeURIComponent(eventId)}/publish`,
    { method: "POST" },
    "Unable to publish the event."
  );
}

export function createTicketType(
  eventId: string,
  payload: CreateTicketTypePayload
) {
  return request<TicketType>(
    `/api/staff/events/${encodeURIComponent(eventId)}/ticket-types`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Unable to create the ticket type."
  );
}

export function getAdminTicketTypes(
  eventId: string
) {
  return request<TicketType[]>(
    `/api/staff/events/${encodeURIComponent(eventId)}/ticket-types`,
    { method: "GET", cache: "no-store" },
    "Unable to load ticket types."
  );
}

export function updateTicketType(
  eventId: string,
  ticketTypeId: string,
  payload: UpdateTicketTypePayload
) {
  return request<TicketType>(
    `/api/staff/events/${encodeURIComponent(eventId)}/ticket-types/${encodeURIComponent(ticketTypeId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Unable to update the ticket type."
  );
}
