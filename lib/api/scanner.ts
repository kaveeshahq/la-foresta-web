import type {
  AttendanceSummary,
  CheckInHistory,
  CheckInResponse,
  ScannerTicketLookup,
} from "@/types/scanner";

export class ScannerApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);
    this.name = "ScannerApiError";
    this.status = status;
  }
}

async function readResponse<T>(
  response: Response,
  fallback: string
): Promise<T> {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : fallback;

    throw new ScannerApiError(
      message,
      response.status
    );
  }

  return body as T;
}

export async function lookupScannerTicket(
  qrToken: string
) {
  const response = await fetch(
    `/api/staff/scanner/tickets/${encodeURIComponent(
      qrToken.trim()
    )}`,
    { cache: "no-store" }
  );

  return readResponse<ScannerTicketLookup>(
    response,
    "Unable to look up this ticket."
  );
}

export async function checkInScannerTicket(
  qrToken: string
) {
  const response = await fetch(
    "/api/staff/scanner/check-in",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qrToken: qrToken.trim(),
      }),
    }
  );

  return readResponse<CheckInResponse>(
    response,
    "Unable to check in this ticket."
  );
}

export async function getAttendanceSummary(
  eventId: string
) {
  const response = await fetch(
    `/api/staff/events/${encodeURIComponent(
      eventId
    )}/attendance-summary`,
    { cache: "no-store" }
  );

  return readResponse<AttendanceSummary>(
    response,
    "Unable to load attendance totals."
  );
}

export async function getCheckInHistory(
  eventId: string
) {
  const response = await fetch(
    `/api/staff/events/${encodeURIComponent(
      eventId
    )}/check-ins`,
    { cache: "no-store" }
  );

  return readResponse<CheckInHistory[]>(
    response,
    "Unable to load check-in history."
  );
}
