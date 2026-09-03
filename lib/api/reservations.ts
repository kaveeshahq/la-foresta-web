import { getApiUrl } from "@/lib/api/config";

import type {
  CreateReservationRequest,
  GuestReservationRequest,
  Reservation,
} from "@/types/reservation";

export class ReservationApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name =
      "ReservationApiError";

    this.status = status;
  }
}

async function parseErrorMessage(
  response: Response
) {
  try {
    const body =
      await response.json();

    if (
      typeof body?.message ===
      "string"
    ) {
      return body.message;
    }

    if (
      typeof body?.error ===
      "string"
    ) {
      return body.error;
    }
  } catch {
    // Ignore malformed error JSON.
  }

  return "Unable to create reservation.";
}

export async function createGuestReservation(
  request: GuestReservationRequest
): Promise<Reservation> {
  const response = await fetch(
    getApiUrl(
      "/api/guest/reservations"
    ),
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        request
      ),
    }
  );

  if (!response.ok) {
    throw new ReservationApiError(
      await parseErrorMessage(
        response
      ),
      response.status
    );
  }

  return response.json();
}

export async function createRegisteredReservation(
  request: CreateReservationRequest
): Promise<Reservation> {
  const response = await fetch(
    "/api/customer/reservations",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new ReservationApiError(
      await parseErrorMessage(
        response
      ),
      response.status
    );
  }

  return response.json();
}

export async function createReservation(
  request: CreateReservationRequest,
  accessToken: string
): Promise<Reservation> {
  const response = await fetch(
    getApiUrl(
      "/api/reservations"
    ),
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${accessToken}`,
      },

      body: JSON.stringify(
        request
      ),
    }
  );

  if (!response.ok) {
    throw new ReservationApiError(
      await parseErrorMessage(
        response
      ),
      response.status
    );
  }

  return response.json();
}
