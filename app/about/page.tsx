import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  AudioLines,
  Sparkles,
  Trees,
  UsersRound,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover the ideas behind La Foresta: electronic sound, immersive environments and collective energy in Sri Lanka.",
};

const principles = [
  {
    number: "01",
    title: "Sound",
    description:
      "Lineups are shaped as a complete arc, giving every artist and every hour a purpose within the night.",
    icon: AudioLines,
  },
  {
    number: "02",
    title: "Space",
    description:
      "Light, landscape and architecture are treated as part of the performance—not decoration around it.",
    icon: Trees,
  },
  {
    number: "03",
    title: "People",
    description:
      "The strongest memories emerge from a present, respectful crowd moving through one shared experience.",
    icon: UsersRound,
  },
  {
    number: "04",
    title: "Detail",
    description:
      "From first arrival to the closing track, each transition is considered so the journey feels intentional.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-background">
        <section className="lf-noise lf-grid relative flex min-h-[92svh] items-end overflow-hidden pb-12 pt-32 sm:pb-16">
          <div className="absolute inset-0">
            <Image
              src="/media/moments/moment-04.jpg"
              alt="Immersive La Foresta environment at night"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/20 to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(111,255,153,0.13),transparent_34%)]" />
          </div>

          <div className="lf-container relative z-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <p className="font-technical text-[9px] uppercase tracking-[0.28em] text-electric sm:text-xs">
                About / La Foresta
              </p>
              <p className="font-technical hidden text-[8px] uppercase tracking-[0.2em] text-white/55 sm:block">
                Sri Lanka / After dark
              </p>
            </div>

            <h1 className="font-display mt-10 max-w-6xl text-[clamp(4.4rem,16vw,13rem)] font-semibold leading-[0.72] tracking-[-0.08em]">
              MADE TO
              <br />
              BE FELT
              <span className="text-electric">.</span>
            </h1>

            <div className="mt-10 grid gap-7 border-t border-white/15 pt-7 lg:grid-cols-[1fr_0.55fr] lg:items-end">
              <p className="max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                La Foresta creates electronic-music
                experiences where sound, light, place
                and people become one environment.
              </p>
              <p className="font-technical max-w-sm text-[9px] uppercase leading-6 tracking-[0.18em] text-white/50 lg:justify-self-end">
                Not simply a stage. Not simply a crowd.
                A temporary world built together.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-[clamp(7rem,12vw,12rem)]">
          <div className="pointer-events-none absolute left-[-12rem] top-[10%] size-[38rem] rounded-full bg-forest-light/8 blur-[170px]" />
          <div className="lf-container relative z-10">
            <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
              01 / The idea
            </p>

            <div className="mt-8 grid gap-12 border-t border-white/10 pt-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h2 className="font-display text-[clamp(3.7rem,10vw,9rem)] leading-[0.8] tracking-[-0.07em]">
                A night can
                <br />
                change shape.
              </h2>
              <div className="max-w-md space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
                <p>
                  We approach each gathering as a
                  journey. Energy grows, rooms transform
                  and strangers become a temporary
                  community through movement.
                </p>
                <p>
                  The result is an experience that feels
                  specific to its place and impossible to
                  repeat in exactly the same way.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="lf-grid relative overflow-hidden border-y border-white/10 bg-card/25 py-[clamp(6rem,10vw,10rem)]">
          <div className="lf-container">
            <div className="flex items-center justify-between">
              <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
                02 / Our principles
              </p>
              <span className="size-2 rounded-full bg-electric shadow-[0_0_18px_var(--electric)]" />
            </div>

            <div className="mt-10 grid border-l border-t border-white/10 sm:grid-cols-2">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <article
                    key={principle.number}
                    className="group min-h-80 border-b border-r border-white/10 p-6 transition-colors hover:bg-electric/[0.025] sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-technical text-[9px] tracking-[0.2em] text-electric">
                        {principle.number}
                      </span>
                      <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-electric" />
                    </div>
                    <h3 className="font-display mt-20 text-4xl tracking-[-0.05em] sm:text-5xl">
                      {principle.title}
                    </h3>
                    <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                      {principle.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-[clamp(7rem,12vw,12rem)]">
          <div className="pointer-events-none absolute bottom-[-15rem] right-[-12rem] size-[42rem] rounded-full bg-electric/7 blur-[180px]" />
          <div className="lf-container relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 lg:col-span-5">
              <Image
                src="/media/moments/moment-03.jpg"
                alt="Artist performing during a La Foresta night"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-electric/10" />
              <p className="font-technical absolute bottom-5 left-5 text-[8px] uppercase tracking-[0.2em] text-white/65">
                Sound / Movement / Connection
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric">
                03 / From here
              </p>
              <h2 className="font-display mt-8 text-[clamp(3.8rem,9vw,8rem)] leading-[0.78] tracking-[-0.07em]">
                Rooted in
                <br />
                Sri Lanka.
              </h2>
              <p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
                Our surroundings influence the rhythm of
                every experience—from tropical night air
                and open landscapes to the pulse of the
                city. La Foresta belongs to this place
                while remaining open to sounds from
                everywhere.
              </p>
              <Link
                href="/gallery"
                className="group mt-10 flex w-fit items-center gap-4 border border-white/15 px-5 py-4 transition-colors hover:border-electric hover:text-electric"
              >
                <span className="font-technical text-[9px] uppercase tracking-[0.2em]">
                  Enter the gallery
                </span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lf-grid relative flex min-h-[80svh] items-center overflow-hidden border-t border-white/10 py-24 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[180px]" />
          <div className="lf-container relative z-10 flex flex-col items-center">
            <p className="font-technical text-[9px] uppercase tracking-[0.28em] text-electric">
              The next chapter
            </p>
            <h2 className="font-display mt-8 text-[clamp(4rem,14vw,11rem)] font-semibold leading-[0.74] tracking-[-0.08em]">
              MEET US
              <br />
              IN THE FOREST<span className="text-electric">.</span>
            </h2>
            <Link
              href="/events"
              className="group mt-10 flex min-w-64 items-center justify-between bg-electric px-6 py-5 text-background"
            >
              <span className="font-technical text-[9px] uppercase tracking-[0.2em]">
                Explore events
              </span>
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
