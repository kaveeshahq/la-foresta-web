import { getApiUrl } from "@/lib/api/config";

import type { Ticket } from "@/types/ticket";

export class TicketApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name = "TicketApiError";
    this.status = status;
  }
}

async function getErrorMessage(
  response: Response
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

  return "Unable to load tickets.";
}

export async function getGuestTickets(
  accessToken: string
): Promise<Ticket[]> {
  const response = await fetch(
    getApiUrl("/api/guest/tickets/access"),
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        accessToken,
      }),
    }
  );

  if (!response.ok) {
    throw new TicketApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}

export async function getRegisteredTickets(): Promise<
  Ticket[]
> {
  const response = await fetch(
    "/api/customer/tickets",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new TicketApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}
