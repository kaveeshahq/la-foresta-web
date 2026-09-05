import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPage({
  eyebrow,
  title,
  introduction,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <>
      <SiteHeader />

      <main className="lf-grid relative min-h-screen overflow-hidden bg-background pb-24 pt-36 sm:pb-32 sm:pt-44">
        <div className="pointer-events-none absolute right-[-16rem] top-20 size-[42rem] rounded-full bg-electric/6 blur-[180px]" />

        <div className="lf-container relative z-10">
          <header className="border-b border-white/10 pb-12 sm:pb-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-technical text-[9px] uppercase tracking-[0.28em] text-electric">
                {eyebrow}
              </p>
              <p className="font-technical text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                Last updated / {lastUpdated}
              </p>
            </div>

            <h1 className="font-display mt-10 text-[clamp(4rem,13vw,10rem)] font-semibold leading-[0.74] tracking-[-0.08em]">
              {title}<span className="text-electric">.</span>
            </h1>

            <p className="mt-10 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              {introduction}
            </p>
          </header>

          <div className="mx-auto mt-14 max-w-4xl sm:mt-20">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className="grid gap-6 border-b border-white/10 py-10 sm:grid-cols-[8rem_1fr] sm:gap-10 sm:py-14"
              >
                <p className="font-technical text-[9px] tracking-[0.22em] text-electric">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="font-display text-3xl tracking-[-0.04em] sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 [&_li]:pl-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:marker:text-electric">
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
