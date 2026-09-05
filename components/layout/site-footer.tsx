import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background">
      <div className="pointer-events-none absolute bottom-[-18rem] left-[15%] size-[34rem] rounded-full bg-forest-light/5 blur-[150px]" />

      <div className="lf-container relative z-10 py-10 sm:py-14">
        <div className="grid gap-12 md:grid-cols-[1fr_auto_auto] md:items-start md:gap-16">
          <div>
            <Link
              href="/"
              className="font-display text-3xl font-semibold tracking-[-0.05em]"
            >
              LA FORESTA
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Electronic culture,
              immersive environments and
              collective experiences from
              Sri Lanka.
            </p>
          </div>

          <div>
            <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Explore
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                href="/events"
                className="transition-colors hover:text-electric"
              >
                Events
              </Link>

              <Link
                href="/#experience"
                className="transition-colors hover:text-electric"
              >
                Experience
              </Link>

              <Link
                href="/gallery"
                className="transition-colors hover:text-electric"
              >
                Gallery
              </Link>

              <Link
                href="/about"
                className="transition-colors hover:text-electric"
              >
                About
              </Link>
            </div>
          </div>

          <div>
            <p className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Social
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              {["Instagram", "Facebook", "TikTok"].map(
                (platform) => (
                  <span
                    key={platform}
                    className="flex items-center justify-between gap-5 text-muted-foreground"
                    aria-label={`${platform}, coming soon`}
                  >
                    {platform}
                    <span className="font-technical text-[7px] uppercase tracking-[0.16em] text-electric/65">
                      Soon
                    </span>
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-6 sm:mt-16 md:flex-row md:items-center md:justify-between">
          <p className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground">
            &copy; 2026 La Foresta
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="font-technical text-[8px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
