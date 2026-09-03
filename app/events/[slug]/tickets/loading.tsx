export default function TicketsLoading() {
  return (
    <main className="lf-grid min-h-[100svh] bg-background">
      <div className="lf-container flex min-h-[100svh] items-center">
        <div>
          <span className="block size-2 animate-pulse rounded-full bg-electric" />

          <p className="font-technical mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Loading tickets
          </p>
        </div>
      </div>
    </main>
  );
}