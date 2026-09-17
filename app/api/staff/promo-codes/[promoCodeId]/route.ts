import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ promoCodeId: string }>;
  }
) {
  const { promoCodeId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/promo-codes/${encodeURIComponent(promoCodeId)}`,
    { cache: "no-store" }
  );
}

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ promoCodeId: string }>;
  }
) {
  const { promoCodeId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/promo-codes/${encodeURIComponent(promoCodeId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
