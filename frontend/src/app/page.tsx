import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const FEATURES = [
  {
    title: 'Token explorer',
    description:
      'Browse a live market of tokens with search, sort, and pagination — backed by your aggregator API.',
    href: '/tokens',
    cta: 'Open explorer',
  },
  {
    title: 'Personal watchlist',
    description:
      'Sign in to track tokens you care about. Add them from the detail page in one click.',
    href: '/dashboard/watchlist',
    cta: 'Open watchlist',
  },
  {
    title: 'Wallet lookup',
    description:
      'Paste any EVM wallet address to inspect its on-chain holdings via the wallet provider.',
    href: '/wallet-checker',
    cta: 'Check a wallet',
  },
];

export default function LandingPage() {
  return (
    <Container className="flex flex-col gap-20 py-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-border bg-bg-panel px-3 py-1 text-xs uppercase tracking-wide text-text-muted">
          Token Aggregation Dashboard
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          A Web3 dashboard for tokens, watchlists, and wallet lookups.
        </h1>
        <p className="max-w-2xl text-base text-text-muted sm:text-lg">
          Browse tokens streamed from your aggregation API, save the ones you care about,
          and inspect any EVM wallet — all from one polished frontend.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/tokens">
            <Button size="lg">Explore tokens</Button>
          </Link>
          <Link href="/wallet-checker">
            <Button variant="secondary" size="lg">
              Wallet lookup
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardBody className="flex h-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-base font-semibold text-text">{feature.title}</h2>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </div>
              <div className="mt-auto">
                <Link
                  href={feature.href}
                  className="text-sm font-medium text-brand hover:text-brand-hover"
                >
                  {feature.cta} →
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
    </Container>
  );
}
