import { getApiUrl } from "@/lib/api/config";

import type {
  InitiatePaymentRequest,
  Payment,
} from "@/types/payment";

export class PaymentApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.name = "PaymentApiError";
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
    // Ignore malformed API error.
  }

  return "Payment request failed.";
}

async function paymentRequest(
  path: string,
  options?: RequestInit
): Promise<Payment> {
  const response = await fetch(
    getApiUrl(path),
    options
  );

  if (!response.ok) {
    throw new PaymentApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json();
}

export async function initiateGuestMockPayment(
  request: InitiatePaymentRequest
): Promise<Payment> {
  return paymentRequest(
    "/api/guest/payments/mock/initiate",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    }
  );
}

export async function completeGuestMockPayment(
  paymentId: string
): Promise<Payment> {
  return paymentRequest(
    `/api/guest/payments/mock/${encodeURIComponent(
      paymentId
    )}/success`,
    {
      method: "POST",
    }
  );
}

export async function failGuestMockPayment(
  paymentId: string
): Promise<Payment> {
  return paymentRequest(
    `/api/guest/payments/mock/${encodeURIComponent(
      paymentId
    )}/failure`,
    {
      method: "POST",
    }
  );
}

export async function getGuestMockPayment(
  paymentId: string
): Promise<Payment> {
  return paymentRequest(
    `/api/guest/payments/mock/${encodeURIComponent(
      paymentId
    )}`
  );
}

async function registeredPaymentRequest(
  path: string,
  options?: RequestInit
) {
  const response = await fetch(
    path,
    options
  );

  if (!response.ok) {
    throw new PaymentApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response.json() as Promise<Payment>;
}

export function initiateRegisteredMockPayment(
  request: InitiatePaymentRequest
) {
  return registeredPaymentRequest(
    "/api/customer/payments/mock/initiate",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(request),
    }
  );
}

export function completeRegisteredMockPayment(
  paymentId: string
) {
  return registeredPaymentRequest(
    `/api/customer/payments/mock/${encodeURIComponent(
      paymentId
    )}/success`,
    { method: "POST" }
  );
}

export function failRegisteredMockPayment(
  paymentId: string
) {
  return registeredPaymentRequest(
    `/api/customer/payments/mock/${encodeURIComponent(
      paymentId
    )}/failure`,
    { method: "POST" }
  );
}
