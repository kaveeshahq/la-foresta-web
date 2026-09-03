import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Account / Registration"
      title={
        <>
          Join the
          <br />
          frequency
        </>
      }
      description="Create an account for future registered checkout, order history and My Tickets access."
    >
      <RegisterForm />
    </AuthShell>
  );
}
