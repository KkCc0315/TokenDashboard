'use client';

import { FormEvent, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatApiError } from '@/lib/api';
import { formatBalance, formatCompactUsd, shortenAddress } from '@/lib/format';
import { lookupWallet } from '@/services/wallet';
import { WalletLookupResponse } from '@/types/wallet';

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

const CHAIN_OPTIONS = [
  { value: 'eth', label: 'Ethereum' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'bsc', label: 'BNB Chain' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'base', label: 'Base' },
];

export default function WalletCheckerPage() {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('eth');
  const [addressError, setAddressError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<WalletLookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ADDRESS_PATTERN.test(address.trim())) {
      setAddressError('Enter a valid EVM address (0x… 40 hex chars).');
      return;
    }
    setAddressError(undefined);
    setSubmitError(null);
    setIsLoading(true);
    try {
      const response = await lookupWallet({ address: address.trim(), chain });
      setResult(response);
    } catch (cause) {
      setResult(null);
      setSubmitError(formatApiError(cause));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-text">Wallet lookup</h1>
        <p className="text-sm text-text-muted">
          Inspect on-chain holdings for any EVM wallet. Backend uses your wallet provider.
        </p>
      </header>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Input
                label="Wallet address"
                name="address"
                placeholder="0x…"
                value={address}
                error={addressError}
                onChange={(event) => setAddress(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <label className="flex flex-col gap-1.5 md:w-44">
              <span className="text-sm font-medium text-text">Chain</span>
              <select
                value={chain}
                onChange={(event) => setChain(event.target.value)}
                className="h-10 rounded-md border border-border bg-bg-subtle px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {CHAIN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" isLoading={isLoading} size="lg">
              Look up
            </Button>
          </form>
        </CardBody>
      </Card>

      {submitError && <ErrorState message={submitError} />}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && result && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">Wallet</span>
              <span className="font-mono text-sm text-text" title={result.address}>
                {shortenAddress(result.address)}
              </span>
            </div>
            <Badge tone="brand">{result.chain}</Badge>
            <Badge tone="neutral">{result.totalTokens} tokens</Badge>
          </div>

          {result.holdings.length === 0 ? (
            <EmptyState
              title="No holdings found"
              description="The provider returned no tokens for this wallet on the selected chain."
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-bg-panel">
              <ul className="divide-y divide-border-subtle">
                {result.holdings.map((holding, index) => (
                  <li
                    key={`${holding.tokenAddress ?? holding.symbol}-${index}`}
                    className="grid grid-cols-2 gap-3 px-5 py-3 sm:grid-cols-[2fr_1fr_1fr]"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text">{holding.name}</span>
                      <span className="text-xs uppercase text-text-muted">
                        {holding.symbol}
                        {holding.tokenAddress && (
                          <span title={holding.tokenAddress}>
                            {' · '}
                            {shortenAddress(holding.tokenAddress)}
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-right text-sm tabular-nums">
                      <span className="block text-xs uppercase text-text-muted sm:hidden">
                        Balance
                      </span>
                      {formatBalance(holding.balance)}
                    </span>
                    <span className="text-right text-sm tabular-nums text-text-muted">
                      <span className="block text-xs uppercase sm:hidden">USD value</span>
                      {formatCompactUsd(holding.usdValue)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {!isLoading && !result && !submitError && (
        <EmptyState
          title="No wallet looked up yet"
          description="Paste an EVM address above and choose a chain to see holdings."
        />
      )}
    </Container>
  );
}
