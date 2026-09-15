import type {
  AdminCustomer,
  AdminTicketLookup,
} from "@/types/support";

export class SupportApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SupportApiError";
    this.status = status;
  }
}

async function readResponse<T>(
  response: Response,
  fallback: string
): Promise<T> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    // The fallback handles empty or malformed error responses.
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : fallback;

    throw new SupportApiError(message, response.status);
  }

  return body as T;
}

export async function findCustomerByEmail(email: string) {
  const response = await fetch(
    `/api/staff/customers?email=${encodeURIComponent(email.trim())}`,
    { cache: "no-store" }
  );

  return readResponse<AdminCustomer>(
    response,
    "Unable to find the customer."
  );
}

export async function findTicketByNumber(
  ticketNumber: string
) {
  const response = await fetch(
    `/api/staff/tickets?ticketNumber=${encodeURIComponent(ticketNumber.trim())}`,
    { cache: "no-store" }
  );

  return readResponse<AdminTicketLookup>(
    response,
    "Unable to find the ticket."
  );
}
