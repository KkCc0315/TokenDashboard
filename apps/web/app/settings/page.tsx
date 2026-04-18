import { DashboardShell } from "@/components/dashboard-shell";
import { getTokens, getUserPreferences } from "@/lib/api";
import { requireUserSession } from "@/lib/auth";
import { PreferencesForm } from "./preferences-form";
import { ProfileForm } from "./profile-form";

export default async function SettingsPage() {
  const user = await requireUserSession();
  const preferences = await getUserPreferences();
  const tokens = await getTokens();
  const chains = ["All", ...new Set(tokens.map((token) => token.chain))];

  return (
    <DashboardShell
      eyebrow="Account controls"
      title="Settings"
      description="Profile details and saved dashboard preferences are read from and written to the authenticated MySQL-backed user record."
      user={user}
    >
      <section className="grid gap-4 xl:grid-cols-2">
        <ProfileForm user={user} />
        <PreferencesForm preferences={preferences} chains={chains} />
      </section>
    </DashboardShell>
  );
}
