import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type AttendanceRouteProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: AttendanceRouteProps
) {
  const { eventId } = await params;

  return proxyCustomerRequest(
    `/api/admin/events/${encodeURIComponent(
      eventId
    )}/attendance-summary`,
    { cache: "no-store" }
  );
}
