import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white/90 p-8 text-center shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you were looking for does not exist or has been moved.</p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
