import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { AuthForm } from "./auth-form";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <DashboardShell
      eyebrow="Secure access"
      title="Authentication"
      description="Create an account or sign in to access protected dashboard routes, a JWT-backed session, and a watchlist that is scoped to your user instead of shared demo state."
    >
      <section className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft">
        <AuthForm />

        <div className="mt-6 rounded-[28px] bg-mist px-4 py-4 text-sm text-slate-700">
          Session flow: the API issues a signed JWT after login or registration, and the web app stores it in an
          http-only cookie before loading protected routes.
        </div>
      </section>
    </DashboardShell>
  );
}
