import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      eventId: string;
      ticketTypeId: string;
    }>;
  }
) {
  const { eventId, ticketTypeId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(eventId)}/ticket-types/${encodeURIComponent(ticketTypeId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
