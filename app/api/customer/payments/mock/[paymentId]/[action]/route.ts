import { NextResponse } from "next/server";

import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type PaymentActionRouteProps = {
  params: Promise<{
    paymentId: string;
    action: string;
  }>;
};

export async function POST(
  _request: Request,
  { params }: PaymentActionRouteProps
) {
  const {
    paymentId,
    action,
  } = await params;

  if (
    action !== "success" &&
    action !== "failure"
  ) {
    return NextResponse.json(
      { message: "Not found." },
      { status: 404 }
    );
  }

  return proxyCustomerRequest(
    `/api/payments/mock/${encodeURIComponent(
      paymentId
    )}/${action}`,
    { method: "POST" }
  );
}
