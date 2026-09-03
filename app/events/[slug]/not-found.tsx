import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";

export default function EventNotFound() {
  return (
    <>
      <SiteHeader />

      <main className="lf-grid min-h-[100svh] bg-background">
        <div className="lf-container flex min-h-[100svh] flex-col justify-center">
          <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
            404 / Experience
          </p>

          <h1 className="font-display mt-8 text-[clamp(4rem,11vw,10rem)] font-semibold leading-[0.78] tracking-[-0.075em]">
            Lost in
            <br />
            the forest.
          </h1>

          <p className="mt-8 max-w-md text-base leading-8 text-muted-foreground">
            This experience could not
            be found or is no longer
            publicly available.
          </p>

          <Link
            href="/events"
            className="mt-10 flex w-fit items-center gap-4 font-technical text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="size-4" />
            Back to events
          </Link>
        </div>
      </main>
    </>
  );
}