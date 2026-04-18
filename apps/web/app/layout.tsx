import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Token Aggregation Dashboard",
  description: "Browse tokens, inspect wallets, track a watchlist, and work with cached market data."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
