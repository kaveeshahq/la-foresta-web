import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { next } = await searchParams;

  const nextPath =
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//")
      ? next
      : "/account";

  return (
    <AuthShell
      eyebrow="Account / Sign in"
      title={
        <>
          Return to
          <br />
          the forest
        </>
      }
      description="Sign in to access your La Foresta account and continue toward registered ticketing."
    >
      <LoginForm nextPath={nextPath} />
    </AuthShell>
  );
}
