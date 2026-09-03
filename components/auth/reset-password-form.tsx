"use client";

import Link from "next/link";
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
import { resetPassword } from "@/lib/api/auth";

export function ResetPasswordForm({
  token,
}: {
  token: string;
}) {
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [complete, setComplete] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form =
      new FormData(event.currentTarget);
    const password = String(
      form.get("password") ?? ""
    );
    const confirmation = String(
      form.get("passwordConfirmation") ??
        ""
    );

    if (password !== confirmation) {
      setError(
        "The password confirmation does not match."
      );
      setLoading(false);
      return;
    }

    try {
      await resetPassword(
        token,
        password
      );
      setComplete(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  if (complete) {
    return (
      <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
        <AuthSuccess>
          Your password has been updated.
          Existing sessions were revoked.
        </AuthSuccess>

        <Link
          href="/login"
          className="font-technical mt-8 inline-block text-[10px] uppercase tracking-[0.2em] text-electric"
        >
          Sign in with new password
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 bg-card/40 p-6 sm:p-8"
    >
      <div>
        <label
          htmlFor="password"
          className={labelClassName}
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          className={inputClassName}
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="passwordConfirmation"
          className={labelClassName}
        >
          Confirm new password
        </label>
        <input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          className={inputClassName}
        />
      </div>

      <AuthError message={error} />

      <SubmitButton
        loading={loading}
        label="Update password"
        loadingLabel="Updating..."
      />
    </form>
  );
}
