import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ eventId: string }>;
  }
) {
  const { eventId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(eventId)}/ticket-types`,
    { cache: "no-store" }
  );
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ eventId: string }>;
  }
) {
  const { eventId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(eventId)}/ticket-types`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
