"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  LogOut,
  ReceiptText,
  ScanLine,
  Search,
  ShieldCheck,
  TicketCheck,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  AuthApiError,
  getCurrentUser,
  logout,
} from "@/lib/api/auth";
import type { CurrentUser } from "@/types/auth";

export function AccountClient() {
  const router = useRouter();
  const [user, setUser] =
    useState<CurrentUser | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const result =
          await getCurrentUser();

        if (active) {
          setUser(result);
        }
      } catch (caught) {
        if (!active) {
          return;
        }

        if (
          caught instanceof AuthApiError &&
          caught.status === 401
        ) {
          router.replace(
            "/login?next=/account"
          );
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load your account."
        );
      }
    };

    void loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
    } finally {
      router.replace("/");
      router.refresh();
    }
  };

  if (error) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm leading-7 text-destructive">
          {error}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-40 border border-white/10 bg-card/40 p-6">
        <span className="block size-2 animate-pulse rounded-full bg-electric" />
        <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Loading account
        </p>
      </div>
    );
  }

  const canAccessScanner =
    user.roles.some((role) =>
      [
        "SCANNER_STAFF",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    );

  const canAccessAttendance =
    user.roles.some((role) =>
      [
        "EVENT_MANAGER",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    );

  const canAccessOrderOperations =
    user.roles.some((role) =>
      [
        "FINANCE_MANAGER",
        "SUPPORT_AGENT",
        "ADMIN",
        "SUPER_ADMIN",
      ].includes(role)
    );

  return (
    <div className="border border-white/10 bg-card/40 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-6">
        <UserRound className="size-8 text-electric" />

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 font-technical text-[9px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {loggingOut
            ? "Signing out"
            : "Sign out"}
        </button>
      </div>

      <p className="font-technical mt-10 text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
        Email
      </p>
      <p className="font-display mt-2 break-all text-2xl tracking-[-0.04em]">
        {user.email}
      </p>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-electric" />
          <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            Account roles
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <span
              key={role}
              className="border border-white/10 px-3 py-2 font-technical text-[8px] uppercase tracking-[0.16em]"
            >
              {role.replaceAll("_", " ")}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-muted-foreground">
        Tickets issued from registered
        purchases are available through
        your protected account.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {canAccessScanner && (
          <Link
            href="/scanner"
            className="group flex items-center justify-between border border-electric/25 p-4 transition-colors hover:border-electric/60"
          >
            <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
              Staff scanner
            </span>
            <ScanLine className="size-4 text-electric" />
          </Link>
        )}

        {canAccessAttendance && (
          <Link
            href="/operations/attendance"
            className="group flex items-center justify-between border border-electric/25 p-4 transition-colors hover:border-electric/60"
          >
            <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
              Attendance
            </span>
            <Activity className="size-4 text-electric" />
          </Link>
        )}

        {canAccessOrderOperations && (
          <Link
            href="/operations/orders"
            className="group flex items-center justify-between border border-electric/25 p-4 transition-colors hover:border-electric/60"
          >
            <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
              Order operations
            </span>
            <Search className="size-4 text-electric" />
          </Link>
        )}

        <Link
          href="/account/orders"
          className="group flex items-center justify-between border border-white/10 p-4 transition-colors hover:border-electric/40"
        >
          <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
            My orders
          </span>
          <ReceiptText className="size-4 text-muted-foreground transition-colors group-hover:text-electric" />
        </Link>

        <Link
          href="/account/tickets"
          className="group flex items-center justify-between border border-white/10 p-4 transition-colors hover:border-electric/40"
        >
          <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-electric">
            My tickets
          </span>
          <TicketCheck className="size-4 text-muted-foreground transition-colors group-hover:text-electric" />
        </Link>
      </div>
    </div>
  );
}
