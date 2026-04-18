export default function TokenDetailLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-9 w-36 animate-pulse rounded-xl bg-slate-200" />
          </div>
          <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-3xl bg-slate-50" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-[28px] bg-slate-200" />
        <div className="h-14 animate-pulse rounded-[28px] bg-slate-100" />
      </div>
    </div>
  );
}
