import { OrderOperationsClient } from "@/components/operations/order-operations-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default async function OrderOperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

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
      description="Search guest and registered purchases, inspect payments and tickets, and process authorized development refunds."
    >
      <OrderOperationsClient initialEmail={email ?? ""} />
    </AuthShell>
  );
}
