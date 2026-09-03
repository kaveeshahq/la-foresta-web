import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET() {
  return proxyCustomerRequest(
    "/api/tickets"
  );
}
