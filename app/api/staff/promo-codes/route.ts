import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET() {
  return proxyCustomerRequest(
    "/api/admin/promo-codes",
    { cache: "no-store" }
  );
}

export async function POST(request: Request) {
  return proxyCustomerRequest(
    "/api/admin/promo-codes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
