import { AuthShell } from "@/components/auth/auth-shell";
import { EmailRequestForm } from "@/components/auth/email-request-form";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const verificationToken =
    typeof token === "string" &&
    token.trim().length > 0
      ? token
      : null;

  return (
    <AuthShell
      eyebrow="Account / Verification"
      title={
        <>
          Verify your
          <br />
          signal
        </>
      }
      description={
        verificationToken
          ? "Complete email verification using the secure token from your account email."
          : "Request a new verification email if your original link is missing or expired."
      }
    >
      {verificationToken ? (
        <VerifyEmailForm
          token={verificationToken}
        />
      ) : (
        <EmailRequestForm mode="verification" />
      )}
    </AuthShell>
  );
}
