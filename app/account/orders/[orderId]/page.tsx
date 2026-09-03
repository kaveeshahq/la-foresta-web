import { OrderDetailClient } from "@/components/account/order-detail-client";
import { AuthShell } from "@/components/auth/auth-shell";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderPage({
  params,
}: OrderPageProps) {
  const { orderId } = await params;

  return (
    <AuthShell
      eyebrow="Account / Order"
      title={
        <>
          Order
          <br />
          details
        </>
      }
      description="Server-authoritative pricing, discount and order status for this registered purchase."
    >
      <OrderDetailClient
        orderId={orderId}
      />
    </AuthShell>
  );
}
