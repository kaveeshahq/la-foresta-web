import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET() {
  return proxyCustomerRequest(
    "/api/admin/events",
    { cache: "no-store" }
  );
}

export async function POST(request: Request) {
  return proxyCustomerRequest(
    "/api/admin/events",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
