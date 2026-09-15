"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CalendarRange,
  LifeBuoy,
  LoaderCircle,
  ReceiptText,
  ScanLine,
  Search,
  ShieldCheck,
  TicketCheck,
  UserRound,
} from "lucide-react";
import {
  type ComponentType,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AuthApiError,
  getCurrentUser,
} from "@/lib/api/auth";
import type { CurrentUser } from "@/types/auth";

type DashboardLink = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  roles?: string[];
  operational?: boolean;
};

const dashboardLinks: DashboardLink[] = [
  {
    title: "Event Studio",
    description:
      "Create venues, events and ticket inventory, then publish when ready.",
    href: "/operations/events",
    icon: CalendarRange,
    roles: ["EVENT_MANAGER", "ADMIN", "SUPER_ADMIN"],
    operational: true,
  },
  {
    title: "Attendance",
    description:
      "Monitor issued tickets, admissions and recent venue check-ins.",
    href: "/operations/attendance",
    icon: Activity,
    roles: ["EVENT_MANAGER", "ADMIN", "SUPER_ADMIN"],
    operational: true,
  },
  {
    title: "Ticket Scanner",
    description:
      "Look up QR tickets and confirm entry from an authorised device.",
    href: "/scanner",
    icon: ScanLine,
    roles: ["SCANNER_STAFF", "ADMIN", "SUPER_ADMIN"],
    operational: true,
  },
  {
    title: "Support Desk",
    description:
      "Look up customer accounts, purchases and individual ticket records.",
    href: "/operations/support",
    icon: LifeBuoy,
    roles: ["SUPPORT_AGENT", "ADMIN", "SUPER_ADMIN"],
    operational: true,
  },
  {
    title: "Order Operations",
    description:
      "Find customer orders, review payments and process permitted refunds.",
    href: "/operations/orders",
    icon: Search,
    roles: [
      "FINANCE_MANAGER",
      "SUPPORT_AGENT",
      "ADMIN",
      "SUPER_ADMIN",
    ],
    operational: true,
  },
  {
    title: "My Tickets",
    description:
      "Open the QR tickets issued to your registered account.",
    href: "/account/tickets",
    icon: TicketCheck,
  },
  {
    title: "My Orders",
    description:
      "Review your purchase history and individual order details.",
    href: "/account/orders",
    icon: ReceiptText,
  },
  {
    title: "Account",
    description:
      "View your email, assigned roles and account session controls.",
    href: "/account",
    icon: UserRound,
  },
];

export function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<
    CurrentUser | null | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch (caught) {
        if (!active) return;

        if (
          caught instanceof AuthApiError &&
          caught.status === 401
        ) {
          router.replace("/login?next=/dashboard");
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load your dashboard."
        );
        setUser(null);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [router]);

  const availableLinks = useMemo(() => {
    if (!user) return [];

    return dashboardLinks.filter(
      (item) =>
        !item.roles ||
        item.roles.some((role) => user.roles.includes(role))
    );
  }, [user]);

  if (error) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-6 text-sm leading-7 text-destructive">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-40 border border-white/10 bg-card/40 p-6">
        <LoaderCircle className="size-5 animate-spin text-electric" />
        <p className="font-technical mt-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Loading your workspace
        </p>
      </div>
    );
  }

  const operationalLinks = availableLinks.filter(
    (item) => item.operational
  );
  const accountLinks = availableLinks.filter(
    (item) => !item.operational
  );

  return (
    <div className="space-y-5">
      <section className="border border-white/10 bg-card/40 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
              Signed in as
            </p>
            <p className="font-display mt-3 break-all text-2xl tracking-[-0.04em]">
              {user.email}
            </p>
          </div>
          <ShieldCheck className="size-6 shrink-0 text-electric" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
          {user.roles.map((role) => (
            <span
              key={role}
              className="border border-electric/20 px-3 py-2 font-technical text-[7px] uppercase tracking-[0.15em] text-electric"
            >
              {role.replaceAll("_", " ")}
            </span>
          ))}
        </div>
      </section>

      {operationalLinks.length > 0 && (
        <DashboardSection
          eyebrow="Operations"
          links={operationalLinks}
        />
      )}

      <DashboardSection
        eyebrow="Personal account"
        links={accountLinks}
      />
    </div>
  );
}

function DashboardSection({
  eyebrow,
  links,
}: {
  eyebrow: string;
  links: DashboardLink[];
}) {
  return (
    <section className="border border-white/10 bg-card/40 p-5 sm:p-6">
      <p className="font-technical border-b border-white/10 pb-5 text-[9px] uppercase tracking-[0.2em] text-electric">
        {eyebrow}
      </p>

      <div className="grid gap-3 pt-5 sm:grid-cols-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-52 flex-col border border-white/10 p-5 transition-colors hover:border-electric/50 hover:bg-electric/[0.025]"
            >
              <div className="flex items-center justify-between text-muted-foreground transition-colors group-hover:text-electric">
                <Icon className="size-5" />
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div className="mt-auto pt-10">
                <h2 className="font-display text-2xl tracking-[-0.04em]">
                  {item.title}
                </h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
