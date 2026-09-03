import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type OrderRouteProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: OrderRouteProps
) {
  const { orderId } = await params;

  return proxyCustomerRequest(
    `/api/orders/${encodeURIComponent(
      orderId
    )}`
  );
}
