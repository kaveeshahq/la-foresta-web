import { AccountClient } from "@/components/auth/account-client";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AccountPage() {
  return (
    <AuthShell
      eyebrow="Account / Overview"
      title={
        <>
          Your
          <br />
          account
        </>
      }
      description="Manage your secure customer session, review registered purchases and open every ticket issued to your account."
    >
      <AccountClient />
    </AuthShell>
  );
}
