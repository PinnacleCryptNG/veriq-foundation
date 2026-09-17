import type { Opportunity } from "@/types/opportunity";
import type { PreStocksAsset } from "@/lib/prestocks/schema";
import { formatClaimedPrice, formatQuantity } from "@/lib/format";

export const MARKET_CONTEXT_LIMITATION =
  "These rows are labeled sources, not a price opinion. PreStocks tokenPrice and markPrice are token-market fields from the PreStocks catalog. Opportunity quoted price is a claimed intake value. Units, instruments, and timestamps differ. This panel does not feed ruleset 2026.09.1, does not mark a finding Consistent, and does not say the opportunity is fair, overpriced, underpriced, safe, or verified. Token exposure is not direct ownership of issuer shares.";

export type MarketContextRow = {
  label: string;
  submitted: string;
  market: string;
};

export function buildMarketContext(args: {
  opportunity: Opportunity;
  asset: PreStocksAsset;
  retrievedAt: string | null;
  freshness: string;
  sourceUrl: string;
}): {
  rows: MarketContextRow[];
  limitation: string;
} {
  const { opportunity, asset, retrievedAt, freshness, sourceUrl } = args;
  return {
    rows: [
      {
        label: "Source",
        submitted: "Local opportunity record (user-entered or demo seed)",
        market: `PreStocks catalog (${sourceUrl})`,
      },
      {
        label: "Name",
        submitted: opportunity.companyName,
        market: asset.name,
      },
      {
        label: "Identifier",
        submitted: opportunity.id,
        market: asset.symbol,
      },
      {
        label: "Instrument",
        submitted: opportunity.instrument,
        market: "PreStocks token (SPV exposure that tracks company price)",
      },
      {
        label: "Quoted / token figures",
        submitted: formatClaimedPrice(opportunity),
        market: `tokenPrice ${formatCatalogNumber(asset.tokenPrice)} (API field; no currency in payload)`,
      },
      {
        label: "Quantity / supply",
        submitted: formatQuantity(opportunity),
        market: `supply ${formatCatalogNumber(asset.supply)} (API field)`,
      },
      {
        label: "Timestamp",
        submitted: `Opportunity updated ${opportunity.updatedAt}`,
        market: retrievedAt
          ? `Catalog retrieved ${retrievedAt} (${freshness})`
          : `No retrieval time (${freshness})`,
      },
    ],
    limitation: MARKET_CONTEXT_LIMITATION,
  };
}

export function formatCatalogNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(value);
}
