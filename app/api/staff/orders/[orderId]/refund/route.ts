import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type RefundRouteProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RefundRouteProps
) {
  const { orderId } = await params;

  return proxyCustomerRequest(
    `/api/admin/orders/${encodeURIComponent(
      orderId
    )}/refund`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: await request.text(),
    }
  );
}
