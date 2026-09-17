import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ promoCodeId: string }>;
  }
) {
  const { promoCodeId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/promo-codes/${encodeURIComponent(promoCodeId)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
