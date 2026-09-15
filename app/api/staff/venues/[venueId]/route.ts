import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ venueId: string }>;
  }
) {
  const { venueId } = await context.params;

  return proxyCustomerRequest(
    `/api/admin/venues/${encodeURIComponent(venueId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    }
  );
}
