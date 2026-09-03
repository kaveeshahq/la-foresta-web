"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useState,
} from "react";

import {
  AuthError,
  inputClassName,
  labelClassName,
  SubmitButton,
} from "@/components/auth/form-parts";
import { login } from "@/lib/api/auth";

export function LoginForm({
  nextPath,
}: {
  nextPath: string;
}) {
  const router = useRouter();
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form =
      new FormData(event.currentTarget);

    try {
      await login(
        String(form.get("email") ?? "").trim(),
        String(form.get("password") ?? "")
      );

      router.replace(nextPath);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to sign in."
      );
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 bg-card/40 p-6 backdrop-blur-xl sm:p-8"
    >
      <div>
        <label
          htmlFor="email"
          className={labelClassName}
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={255}
          className={inputClassName}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className={labelClassName}
          >
            Password
          </label>

          <Link
            href="/forgot-password"
            className="font-technical text-[8px] uppercase tracking-[0.16em] text-electric"
          >
            Forgot password?
          </Link>
        </div>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClassName}
        />
      </div>

      <AuthError message={error} />

      <SubmitButton
        loading={loading}
        label="Sign in"
        loadingLabel="Signing in..."
      />

      <p className="mt-6 text-sm text-muted-foreground">
        New to La Foresta?{" "}
        <Link
          href="/register"
          className="text-electric"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
