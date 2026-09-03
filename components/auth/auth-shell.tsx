import Link from "next/link";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <>
      <SiteHeader />

      <main className="lf-grid relative min-h-[100svh] overflow-hidden bg-background pb-20 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] size-[38rem] rounded-full bg-electric/8 blur-[170px]" />

        <div className="lf-container relative z-10 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
              {eyebrow}
            </p>

            <h1 className="font-display mt-7 text-[clamp(4rem,9vw,8rem)] leading-[0.78] tracking-[-0.07em]">
              {title}
              <span className="text-electric">
                .
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground">
              {description}
            </p>

            <Link
              href="/events"
              className="font-technical mt-10 inline-block text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore events
            </Link>
          </div>

          <div className="lg:pt-4">
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
