import type { DashboardData, Token } from "@/lib/types";

export const mockTokens: Token[] = [
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    chain: "Solana",
    category: "Layer 1",
    price: 168.42,
    change24h: 4.8,
    marketCap: 81200000000,
    volume24h: 3750000000,
    liquidity: "High",
    holders: "1.4M",
    description: "High-throughput chain widely used for consumer apps, memecoins, and DeFi."
  },
  {
    id: "link",
    name: "Chainlink",
    symbol: "LINK",
    chain: "Ethereum",
    category: "Oracle",
    price: 21.16,
    change24h: 2.3,
    marketCap: 12900000000,
    volume24h: 690000000,
    liquidity: "High",
    holders: "762K",
    description: "Cross-chain oracle network used by DeFi, RWAs, and automation protocols."
  },
  {
    id: "ondo",
    name: "Ondo",
    symbol: "ONDO",
    chain: "Ethereum",
    category: "RWA",
    price: 1.28,
    change24h: -1.2,
    marketCap: 1780000000,
    volume24h: 285000000,
    liquidity: "Medium",
    holders: "212K",
    description: "RWA-focused token benefiting from treasury and tokenized asset narratives."
  },
  {
    id: "render",
    name: "Render",
    symbol: "RNDR",
    chain: "Solana",
    category: "AI",
    price: 8.34,
    change24h: 6.4,
    marketCap: 4320000000,
    volume24h: 188000000,
    liquidity: "Medium",
    holders: "198K",
    description: "Decentralized GPU rendering network with strong AI and creator overlap."
  },
  {
    id: "arb",
    name: "Arbitrum",
    symbol: "ARB",
    chain: "Arbitrum",
    category: "Layer 2",
    price: 0.94,
    change24h: -0.6,
    marketCap: 4010000000,
    volume24h: 321000000,
    liquidity: "High",
    holders: "930K",
    description: "Ethereum scaling network with active DeFi, gaming, and treasury governance."
  },
  {
    id: "sei",
    name: "Sei",
    symbol: "SEI",
    chain: "Sei",
    category: "Trading",
    price: 0.71,
    change24h: 3.1,
    marketCap: 2550000000,
    volume24h: 241000000,
    liquidity: "Medium",
    holders: "165K",
    description: "Performance-focused chain pushing trading and parallelized execution use cases."
  }
];

export const mockDashboardData: DashboardData = {
  tokens: mockTokens,
  watchlist: [
    {
      tokenId: "sol",
      note: "Watch for ecosystem rotation above 175",
      targetPrice: 175
    },
    {
      tokenId: "render",
      note: "Momentum entry if AI sector stays strong",
      targetPrice: 9.1
    },
    {
      tokenId: "ondo",
      note: "RWA narrative continuation",
      targetPrice: 1.45
    }
  ],
  wallets: [
    {
      address: "0x71A9...D912",
      totalValue: 18420.55,
      realizedPnl: 12.8,
      tokens: [
        {
          tokenId: "sol",
          balance: "61.5",
          valueUsd: 10357.83
        },
        {
          tokenId: "link",
          balance: "220",
          valueUsd: 4655.2
        },
        {
          tokenId: "ondo",
          balance: "2650",
          valueUsd: 3392
        }
      ]
    }
  ],
  market: {
    updatedAt: "2026-03-12T09:15:00.000Z",
    cacheStatus: "warm",
    dominance: "BTC 51.2% / ETH 16.9%",
    fearGreed: 68,
    trending: ["SOL", "RNDR", "ONDO"]
  },
  dataSource: "fallback"
};
