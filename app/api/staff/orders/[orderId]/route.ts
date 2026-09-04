import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type AdminOrderRouteProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: AdminOrderRouteProps
) {
  const { orderId } = await params;

  return proxyCustomerRequest(
    `/api/admin/orders/${encodeURIComponent(
      orderId
    )}`,
    { cache: "no-store" }
  );
}
