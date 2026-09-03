"use client";

import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type EventErrorProps = {
  reset: () => void;
};

export default function EventError({
  reset,
}: EventErrorProps) {
  return (
    <>
      <SiteHeader />

      <main className="lf-grid min-h-[100svh] bg-background pt-24">
        <section className="lf-container flex min-h-[75svh] items-center py-20">
          <div className="max-w-3xl">
            <AlertTriangle className="size-10 text-electric" />

            <p className="font-technical mt-8 text-[10px] uppercase tracking-[0.25em] text-electric">
              Ticketing service
            </p>

            <h1 className="font-display mt-7 text-[clamp(4rem,10vw,8rem)] leading-[0.78] tracking-[-0.07em]">
              We could not load
              <br />
              this event
              <span className="text-electric">
                .
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground">
              The event service is not
              responding right now. Try
              again once the connection is
              available.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={reset}
                className="group flex min-h-12 items-center gap-3 bg-electric px-5 text-background"
              >
                <span className="font-technical text-[9px] uppercase tracking-[0.2em]">
                  Try again
                </span>

                <RotateCcw className="size-4 transition-transform group-hover:-rotate-45" />
              </button>

              <Link
                href="/events"
                className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                All events
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
