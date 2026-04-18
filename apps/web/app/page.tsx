import { DashboardShell } from "@/components/dashboard-shell";
import { TokenBrowser } from "@/components/token-browser";
import { getDashboardData } from "@/lib/api";
import { requireUserSession } from "@/lib/auth";

export default async function HomePage() {
  const user = await requireUserSession();
  const data = await getDashboardData();

  return (
    <DashboardShell
      eyebrow="Authenticated workspace"
      title="Token Aggregation Dashboard"
      description="A protected operator view for token discovery, wallet visibility, watchlist tracking, and cached market snapshots. User watchlists now load through authenticated API requests instead of shared demo state."
      user={user}
    >
      <TokenBrowser data={data} preferences={user.preferences} />
    </DashboardShell>
  );
}
