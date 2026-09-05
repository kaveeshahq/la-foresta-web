import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Fragments of light, movement and collective energy from La Foresta experiences in Sri Lanka.",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-background">
        <section className="lf-noise lf-grid relative flex min-h-[82svh] items-end overflow-hidden pb-12 pt-32 sm:pb-16">
          <div className="absolute inset-0">
            <Image
              src="/media/moments/moment-05.jpg"
              alt="La Foresta experience after dark"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/25 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_28%,rgba(111,255,153,0.12),transparent_38%)]" />
          </div>

          <div className="lf-container relative z-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <p className="font-technical text-[9px] uppercase tracking-[0.28em] text-electric sm:text-xs">
                Archive / Moments
              </p>
              <p className="font-technical hidden text-[8px] uppercase tracking-[0.2em] text-white/50 sm:block">
                Sound / Light / Movement
              </p>
            </div>

            <h1 className="font-display mt-10 text-[clamp(4.5rem,17vw,14rem)] font-semibold leading-[0.7] tracking-[-0.085em]">
              NIGHT
              <br />
              FRAGMENTS<span className="text-electric">.</span>
            </h1>

            <div className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                Fleeting pieces of atmosphere—held for
                a moment after the music moves on.
              </p>
              <p className="font-technical text-[8px] uppercase tracking-[0.2em] text-electric">
                Select an image to enter
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-[clamp(6rem,10vw,10rem)]">
          <div className="pointer-events-none absolute right-[-14rem] top-[18%] size-[40rem] rounded-full bg-electric/6 blur-[180px]" />
          <div className="lf-container relative z-10">
            <div className="mb-12 grid gap-8 border-b border-white/10 pb-9 lg:grid-cols-[1fr_0.5fr] lg:items-end">
              <div>
                <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
                  01 / The archive
                </p>
                <h2 className="font-display mt-7 text-[clamp(3.6rem,9vw,8rem)] leading-[0.78] tracking-[-0.07em]">
                  Remember
                  <br />
                  the feeling.
                </h2>
              </div>
              <p className="max-w-md text-base leading-8 text-muted-foreground lg:justify-self-end">
                Five perspectives on the same idea:
                sound becoming space, and a crowd
                becoming something larger than itself.
              </p>
            </div>

            <GalleryGrid />

            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6">
              <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
                La Foresta / Sri Lanka
              </p>
              <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-electric">
                05 captured moments
              </p>
            </div>
          </div>
        </section>

        <section className="lf-grid relative overflow-hidden border-t border-white/10 py-[clamp(7rem,12vw,12rem)]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-light/10 blur-[180px]" />
          <div className="lf-container relative z-10 text-center">
            <p className="font-technical text-[9px] uppercase tracking-[0.28em] text-electric">
              Don&apos;t just remember it
            </p>
            <h2 className="font-display mt-8 text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.74] tracking-[-0.08em]">
              LIVE THE
              <br />
              NEXT ONE<span className="text-electric">.</span>
            </h2>
            <div className="mt-10 flex justify-center">
              <Link
                href="/events"
                className="group flex min-w-64 items-center justify-between bg-electric px-6 py-5 text-background"
              >
                <span className="font-technical text-[9px] uppercase tracking-[0.2em]">
                  Explore events
                </span>
                <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
