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
import { register } from "@/lib/api/auth";

export function RegisterForm() {
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formElement =
      event.currentTarget;

    const form =
      new FormData(formElement);
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
      const result = await register(
        String(
          form.get("fullName") ?? ""
        ).trim(),
        String(
          form.get("email") ?? ""
        ).trim(),
        password
      );

      setRegisteredEmail(result.email);
      formElement.reset();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to create your account."
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
      <div>
        <label
          htmlFor="fullName"
          className={labelClassName}
        >
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          maxLength={150}
          className={inputClassName}
        />
      </div>

      <div className="mt-6">
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

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="password"
            className={labelClassName}
          >
            Password
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

        <div>
          <label
            htmlFor="passwordConfirmation"
            className={labelClassName}
          >
            Confirm password
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
      </div>

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        Use between 8 and 72 characters.
      </p>

      <AuthError message={error} />

      {registeredEmail && (
        <AuthSuccess>
          Account created for{" "}
          {registeredEmail}. Check your
          inbox to verify your email.
        </AuthSuccess>
      )}

      <SubmitButton
        loading={loading}
        label="Create account"
        loadingLabel="Creating account..."
      />

      <p className="mt-6 text-sm text-muted-foreground">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-electric"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
