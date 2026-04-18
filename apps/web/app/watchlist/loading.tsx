export default function WatchlistLoading() {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
        <div className="space-y-4">
          <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="h-7 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-80 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-16 animate-pulse rounded-3xl bg-slate-100" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-16 animate-pulse rounded-3xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-3xl bg-slate-100" />
          </div>
          <div className="h-36 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-12 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-[28px] bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
