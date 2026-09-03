import { getApiUrl } from "@/lib/api/config";

import type {
  CreateOrderRequest,
  GuestOrderResponse,
  Order,
} from "@/types/order";

export class OrderApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name = "OrderApiError";
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
    // Ignore invalid JSON errors.
  }

  return "Unable to create order.";
}

export async function createGuestOrder(
  request: CreateOrderRequest
): Promise<GuestOrderResponse> {
  const response = await fetch(
    getApiUrl("/api/guest/orders"),
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new OrderApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}

export async function createRegisteredOrder(
  request: CreateOrderRequest
): Promise<Order> {
  const response = await fetch(
    "/api/customer/orders",
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
    throw new OrderApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}

export async function getRegisteredOrder(
  orderId: string
): Promise<Order> {
  const response = await fetch(
    `/api/customer/orders/${encodeURIComponent(
      orderId
    )}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new OrderApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}

export async function getRegisteredOrders(): Promise<
  Order[]
> {
  const response = await fetch(
    "/api/customer/orders",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new OrderApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}
