import { AccountTicketsClient } from "@/components/account/account-tickets-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AccountTicketsPage() {
  return (
    <AuthShell
      eyebrow="Account / My Tickets"
      title={
        <>
          Your
          <br />
          tickets
        </>
      }
      description="Tickets issued from purchases made while signed in, loaded directly from your protected Spring account API."
    >
      <AccountTicketsClient />
    </AuthShell>
  );
}
