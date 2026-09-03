import type { Event } from "@/types/events";
import type { TicketType } from "@/types/ticket-type";

import { getApiUrl } from "@/lib/api/config";

export class ApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

async function getErrorMessage(
  response: Response,
  fallback: string
) {
  try {
    const body = await response.json();

    if (
      typeof body?.message === "string" &&
      body.message.length > 0
    ) {
      return body.message;
    }

    if (
      typeof body?.error === "string" &&
      body.error.length > 0
    ) {
      return body.error;
    }
  } catch {
    // Ignore malformed API errors.
  }

  return fallback;
}

async function fetchEventsApi(
  path: string
) {
  try {
    return await fetch(
      getApiUrl(path),
      {
        cache: "no-store",
      }
    );
  } catch {
    throw new ApiError(
      "The ticketing service is temporarily unavailable.",
      503
    );
  }
}

export async function getPublishedEvents(): Promise<
  Event[]
> {
  const response = await fetchEventsApi(
    "/api/events"
  );

  if (!response.ok) {
    throw new ApiError(
      await getErrorMessage(
        response,
        "Unable to load events."
      ),
      response.status
    );
  }

  return response.json();
}

export async function getPublishedEventBySlug(
  slug: string
): Promise<Event> {
  const response = await fetchEventsApi(
    `/api/events/${encodeURIComponent(
      slug
    )}`
  );

  if (!response.ok) {
    throw new ApiError(
      await getErrorMessage(
        response,
        "Unable to load event."
      ),
      response.status
    );
  }

  return response.json();
}

export async function getTicketTypes(
  eventId: string
): Promise<TicketType[]> {
  const response = await fetchEventsApi(
    `/api/events/${encodeURIComponent(
      eventId
    )}/ticket-types`
  );

  if (!response.ok) {
    throw new ApiError(
      await getErrorMessage(
        response,
        "Unable to load ticket types."
      ),
      response.status
    );
  }

  return response.json();
}
