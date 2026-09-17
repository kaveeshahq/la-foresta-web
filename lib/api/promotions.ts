import type {
  AdminPromoCode,
  SavePromoCodePayload,
} from "@/types/promotions";

export class PromotionApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PromotionApiError";
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
    throw new PromotionApiError(
      "The promotion service is temporarily unavailable.",
      503
    );
  }

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    // Empty error responses use the operation fallback.
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : fallback;

    throw new PromotionApiError(message, response.status);
  }

  return body as T;
}

export function getAdminPromoCodes() {
  return request<AdminPromoCode[]>(
    "/api/staff/promo-codes",
    { method: "GET", cache: "no-store" },
    "Unable to load promo codes."
  );
}

export function createPromoCode(
  payload: SavePromoCodePayload
) {
  return request<AdminPromoCode>(
    "/api/staff/promo-codes",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Unable to create the promo code."
  );
}

export function updatePromoCode(
  promoCodeId: string,
  payload: SavePromoCodePayload
) {
  return request<AdminPromoCode>(
    `/api/staff/promo-codes/${encodeURIComponent(promoCodeId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    "Unable to update the promo code."
  );
}

export function updatePromoCodeStatus(
  promoCodeId: string,
  active: boolean
) {
  return request<AdminPromoCode>(
    `/api/staff/promo-codes/${encodeURIComponent(promoCodeId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ active }),
    },
    "Unable to update the promo code status."
  );
}
