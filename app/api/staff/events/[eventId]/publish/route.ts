import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function POST(
  _request: Request,
  context: {
    params: Promise<{ eventId: string }>;
  }
) {
  const { eventId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(eventId)}/publish`,
    { method: "POST" }
  );
}
