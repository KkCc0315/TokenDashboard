export default function Loading() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="max-w-3xl space-y-4">
            <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
            <div className="h-10 w-96 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-5 w-80 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="mt-8 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-soft">
            <div className="space-y-4">
              <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="h-7 w-72 animate-pulse rounded-xl bg-slate-200" />
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-[28px] bg-slate-100" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
            <div className="h-56 animate-pulse rounded-[28px] bg-slate-100" />
          </div>
        </div>
      </main>
    </div>
  );
}
