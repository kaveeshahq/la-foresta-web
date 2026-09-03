import { AuthShell } from "@/components/auth/auth-shell";
import { EmailRequestForm } from "@/components/auth/email-request-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account / Recovery"
      title={
        <>
          Reset your
          <br />
          access
        </>
      }
      description="Enter your email address and the backend will send a secure password-reset link when an eligible account exists."
    >
      <EmailRequestForm mode="password" />
    </AuthShell>
  );
}
