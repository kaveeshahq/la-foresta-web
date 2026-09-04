import type {
  AdminOrder,
  AdminOrderSummary,
  RefundResponse,
} from "@/types/operations";

export class OperationsApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);
    this.name = "OperationsApiError";
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

    throw new OperationsApiError(
      message,
      response.status
    );
  }

  return body as T;
}

export async function findOrdersByEmail(
  email: string
) {
  const response = await fetch(
    `/api/staff/orders?email=${encodeURIComponent(
      email.trim()
    )}`,
    { cache: "no-store" }
  );

  return readResponse<AdminOrderSummary[]>(
    response,
    "Unable to search orders."
  );
}

export async function getAdminOrder(
  orderId: string
) {
  const response = await fetch(
    `/api/staff/orders/${encodeURIComponent(
      orderId
    )}`,
    { cache: "no-store" }
  );

  return readResponse<AdminOrder>(
    response,
    "Unable to load this order."
  );
}

export async function refundAdminOrder(
  orderId: string,
  reason: string
) {
  const response = await fetch(
    `/api/staff/orders/${encodeURIComponent(
      orderId
    )}/refund`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: reason.trim(),
      }),
    }
  );

  return readResponse<RefundResponse>(
    response,
    "Unable to refund this order."
  );
}
