import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ eventId: string }>;
  }
) {
  const { eventId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(eventId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
