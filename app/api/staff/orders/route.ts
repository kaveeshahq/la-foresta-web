import { proxyCustomerRequest } from "@/lib/server/customer-proxy";

export async function GET(request: Request) {
  const email = new URL(
    request.url
  ).searchParams.get("email");

  return proxyCustomerRequest(
    `/api/admin/orders?email=${encodeURIComponent(
      email?.trim() ?? ""
    )}`,
    { cache: "no-store" }
  );
}
