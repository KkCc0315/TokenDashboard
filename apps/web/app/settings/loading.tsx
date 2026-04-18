export default function SettingsLoading() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-soft">
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="h-7 w-48 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-4 w-72 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-16 animate-pulse rounded-3xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-3xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
