import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const resetToken =
    typeof token === "string" &&
    token.trim().length > 0
      ? token
      : null;

  return (
    <AuthShell
      eyebrow="Account / New password"
      title={
        <>
          Create new
          <br />
          access
        </>
      }
      description="Choose a new password using the secure reset link sent to your email address."
    >
      {resetToken ? (
        <ResetPasswordForm
          token={resetToken}
        />
      ) : (
        <div className="border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
          <p className="text-sm leading-7 text-destructive">
            This password-reset link does
            not contain a token.
          </p>

          <Link
            href="/forgot-password"
            className="font-technical mt-7 inline-block text-[9px] uppercase tracking-[0.2em] text-electric"
          >
            Request a new link
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
