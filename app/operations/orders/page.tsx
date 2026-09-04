import { OrderOperationsClient } from "@/components/operations/order-operations-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function OrderOperationsPage() {
  return (
    <AuthShell
      eyebrow="Operations / Orders"
      title={
        <>
          Find
          <br />
          resolve
        </>
      }
      description="Search registered customer purchases, inspect payments and tickets, and process authorized development refunds."
    >
      <OrderOperationsClient />
    </AuthShell>
  );
}
