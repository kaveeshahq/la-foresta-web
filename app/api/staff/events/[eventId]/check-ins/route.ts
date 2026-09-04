import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type CheckInsRouteProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: CheckInsRouteProps
) {
  const { eventId } = await params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(
      eventId
    )}/check-ins`,
    { cache: "no-store" }
  );
}
