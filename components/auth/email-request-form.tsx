"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  AuthError,
  AuthSuccess,
  inputClassName,
  labelClassName,
  SubmitButton,
} from "@/components/auth/form-parts";
import {
  requestPasswordReset,
  resendVerification,
} from "@/lib/api/auth";

type EmailRequestFormProps = {
  mode: "password" | "verification";
};

export function EmailRequestForm({
  mode,
}: EmailRequestFormProps) {
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [sent, setSent] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);

    const form =
      new FormData(event.currentTarget);
    const email = String(
      form.get("email") ?? ""
    ).trim();

    try {
      if (mode === "password") {
        await requestPasswordReset(
          email
        );
      } else {
        await resendVerification(
          email
        );
      }

      setSent(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to send this email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 bg-card/40 p-6 backdrop-blur-xl sm:p-8"
    >
      <label
        htmlFor={`${mode}-email`}
        className={labelClassName}
      >
        Email address
      </label>

      <input
        id={`${mode}-email`}
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={255}
        className={inputClassName}
      />

      <AuthError message={error} />

      {sent && (
        <AuthSuccess>
          {mode === "password"
            ? "If a local account exists for that address, a password reset link has been sent."
            : "A new verification link has been sent."}
        </AuthSuccess>
      )}

      <SubmitButton
        loading={loading}
        label={
          mode === "password"
            ? "Send reset link"
            : "Resend verification"
        }
        loadingLabel="Sending..."
      />
    </form>
  );
}
