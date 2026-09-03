import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function POST(
  request: Request
) {
  return proxyCustomerRequest(
    "/api/payments/mock/initiate",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: await request.text(),
    }
  );
}
