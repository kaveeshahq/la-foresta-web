import type { Event } from "@/types/events";

type EventStoryProps = {
  event: Event;
};

export function EventStory({
  event,
}: EventStoryProps) {
  return (
    <section className="relative overflow-hidden bg-background py-[clamp(7rem,12vw,12rem)]">
      <div className="pointer-events-none absolute right-[-14rem] top-[10%] size-[40rem] rounded-full bg-forest-light/8 blur-[170px]" />

      <div className="lf-container relative z-10">
        <div className="flex items-center justify-between">
          <p className="font-technical text-[10px] uppercase tracking-[0.28em] text-electric sm:text-xs">
            01 / The Experience
          </p>

          <p className="font-technical hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
            {event.minimumAge}+ /
            Electronic Culture
          </p>
        </div>

        <div className="mt-7 h-px bg-white/10" />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <h2 className="font-display text-[clamp(3.8rem,8vw,9rem)] font-medium leading-[0.82] tracking-[-0.065em]">
            Into the
            <br />
            eclipse.
          </h2>

          <div className="max-w-xl lg:pt-8">
            {event.description ? (
              <p className="whitespace-pre-line text-base leading-8 text-muted-foreground sm:text-lg">
                {event.description}
              </p>
            ) : (
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                More details about this
                experience will be
                announced soon.
              </p>
            )}

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-7">
              <div>
                <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Minimum age
                </span>

                <p className="font-display mt-3 text-3xl">
                  {event.minimumAge}+
                </p>
              </div>

              <div>
                <span className="font-technical text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Experience
                </span>

                <p className="font-display mt-3 text-3xl">
                  La Foresta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}