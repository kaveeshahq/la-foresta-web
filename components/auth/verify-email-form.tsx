"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AuthError,
  AuthSuccess,
  SubmitButton,
} from "@/components/auth/form-parts";
import { verifyEmail } from "@/lib/api/auth";

export function VerifyEmailForm({
  token,
}: {
  token: string;
}) {
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [verified, setVerified] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyEmail(token);
      setVerified(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to verify your email."
      );
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
        <AuthSuccess>
          Your email address is verified.
        </AuthSuccess>

        <Link
          href="/login"
          className="font-technical mt-8 inline-block text-[10px] uppercase tracking-[0.2em] text-electric"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 bg-card/40 p-6 sm:p-8"
    >
      <p className="text-sm leading-7 text-muted-foreground">
        Confirm this browser request to
        verify the email address connected
        to your La Foresta account.
      </p>

      <AuthError message={error} />

      <SubmitButton
        loading={loading}
        label="Verify email"
        loadingLabel="Verifying..."
      />
    </form>
  );
}
