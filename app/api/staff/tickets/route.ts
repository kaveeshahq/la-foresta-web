import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET(request: Request) {
  const ticketNumber = new URL(request.url).searchParams.get(
    "ticketNumber"
  );

  return proxyCustomerRequest(
    `/api/admin/tickets?ticketNumber=${encodeURIComponent(ticketNumber?.trim() ?? "")}`,
    { cache: "no-store" }
  );
}
