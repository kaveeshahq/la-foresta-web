import {
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import type { ReactNode } from "react";

export const inputClassName =
  "mt-3 h-14 w-full border border-white/10 bg-transparent px-4 outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-electric";

export const labelClassName =
  "font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground";

export function AuthError({
  message,
}: {
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <div className="mt-6 border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm leading-6 text-destructive">
        {message}
      </p>
    </div>
  );
}

export function AuthSuccess({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-6 border border-electric/30 bg-electric/5 p-4">
      <p className="text-sm leading-6 text-foreground">
        {children}
      </p>
    </div>
  );
}

export function SubmitButton({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group mt-8 flex min-h-14 w-full items-center justify-between bg-electric px-5 text-background disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="font-technical text-[10px] uppercase tracking-[0.2em]">
        {loading
          ? loadingLabel
          : label}
      </span>

      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
}
