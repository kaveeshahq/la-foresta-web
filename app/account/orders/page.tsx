import { AccountOrdersClient } from "@/components/account/account-orders-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AccountOrdersPage() {
  return (
    <AuthShell
      eyebrow="Account / My Orders"
      title={
        <>
          Your
          <br />
          orders
        </>
      }
      description="A secure history of purchases made while signed in, with server-authoritative totals and payment status."
    >
      <AccountOrdersClient />
    </AuthShell>
  );
}
