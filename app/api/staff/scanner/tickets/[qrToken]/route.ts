import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

type ScannerTicketRouteProps = {
  params: Promise<{
    qrToken: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: ScannerTicketRouteProps
) {
  const { qrToken } = await params;

  return proxyCustomerRequest(
    `/api/scanner/tickets/${encodeURIComponent(
      qrToken
    )}`,
    { cache: "no-store" }
  );
}
