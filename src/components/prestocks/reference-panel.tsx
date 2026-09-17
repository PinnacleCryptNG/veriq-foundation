"use client";

import { useMemo, useState } from "react";
import { Banner, EmptyState, LoadingState } from "@/components/feedback";
import { LinkButton } from "@/components/link-button";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { FreshnessBanner } from "@/components/prestocks/freshness-banner";
import { PreStocksNotice } from "@/components/prestocks/prestocks-notice";
import { AssetSummary } from "@/components/prestocks/asset-summary";
import { useMarketReference } from "@/hooks/use-market-reference";
import { usePreStocksCatalog } from "@/hooks/use-prestocks-catalog";
import { buildMarketContext } from "@/lib/prestocks/context";
import { suggestPreStocksMatches } from "@/lib/prestocks/match";
import type { Opportunity } from "@/types/opportunity";

export function PreStocksReferencePanel({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  const catalog = usePreStocksCatalog();
  const reference = useMarketReference(opportunity.id);
  const [draftSymbol, setDraftSymbol] = useState("");

  const selected = useMemo(() => {
    const symbol = reference.reference?.symbol;
    if (!symbol) return undefined;
    return catalog.result.assets.find(
      (asset) => asset.symbol.toUpperCase() === symbol.toUpperCase(),
    );
  }, [catalog.result.assets, reference.reference?.symbol]);

  const suggestions = useMemo(
    () => suggestPreStocksMatches(opportunity.companyName, catalog.result.assets),
    [catalog.result.assets, opportunity.companyName],
  );

  const context =
    selected && catalog.result.retrievedAt !== undefined
      ? buildMarketContext({
          opportunity,
          asset: selected,
          retrievedAt: catalog.result.retrievedAt,
          freshness: catalog.result.freshness,
          sourceUrl: catalog.result.sourceUrl,
        })
      : null;

  return (
    <section
      aria-labelledby="prestocks-reference-heading"
      className="space-y-3 rounded-lg border border-border bg-card p-4"
    >
      <SectionHeading
        id="prestocks-reference-heading"
        title="PreStocks market reference"
        description="Optional catalog context. It is not submitted evidence, not a rule input, and not stored in review history. Freshness (live, cached, stale, or unavailable) is labeled on the snapshot below."
        actions={
          <LinkButton
            href={`/prestocks?opportunity=${opportunity.id}`}
            variant="outline"
            size="sm"
          >
            Open PreStocks catalog
          </LinkButton>
        }
      />
      <PreStocksNotice />
      {catalog.isLoading ? (
        <LoadingState label="Loading PreStocks catalog…" />
      ) : (
        <>
          <FreshnessBanner
            freshness={catalog.result.freshness}
            retrievedAt={catalog.result.retrievedAt}
            servedAt={catalog.result.servedAt}
            sourceUrl={catalog.result.sourceUrl}
            warning={catalog.result.warning}
          />
          {reference.warning ? <Banner>{reference.warning}</Banner> : null}
          {reference.persistError ? (
            <Banner tone="danger">{reference.persistError}</Banner>
          ) : null}

          {catalog.result.assets.length === 0 && catalog.result.ok ? (
            <EmptyState
              title="Empty PreStocks catalog"
              description="The catalog request succeeded but returned no assets. No market figures are shown."
            />
          ) : null}

          {!catalog.result.ok && catalog.result.assets.length === 0 ? (
            <EmptyState
              title="PreStocks catalog unavailable"
              description="No market figures are shown. Opportunity records and review history were not changed."
            />
          ) : null}

          {catalog.result.assets.length > 0 ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1 text-sm">
                <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Select a PreStocks asset
                </span>
                <NativeSelect
                  id="prestocks-reference-select"
                  className="mt-1"
                  value={draftSymbol || selected?.symbol || ""}
                  onChange={(event) => setDraftSymbol(event.target.value)}
                >
                  <option value="">No market reference selected</option>
                  {catalog.result.assets.map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol} — {asset.name}
                    </option>
                  ))}
                </NativeSelect>
              </label>
              <Button
                type="button"
                size="sm"
                disabled={!draftSymbol && !selected}
                onClick={() => {
                  const symbol = draftSymbol || selected?.symbol;
                  if (symbol) {
                    reference.select(symbol);
                    setDraftSymbol("");
                  }
                }}
              >
                Use as market reference
              </Button>
              {reference.reference ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    reference.clear();
                    setDraftSymbol("");
                  }}
                >
                  Clear reference
                </Button>
              ) : null}
            </div>
          ) : null}

          {suggestions.length > 0 && !selected ? (
            <Banner>
              Possible name match with {suggestions.map((item) => item.symbol).join(", ")}.
              That is a string comparison on the company name, not issuer confirmation.
              Select an asset to attach it as context.
            </Banner>
          ) : null}

          {reference.reference && !selected && !catalog.isLoading ? (
            <Banner>
              A reference to {reference.reference.symbol} is saved, but that symbol
              is not in the current catalog snapshot. The saved selection was not
              replaced with another asset.
            </Banner>
          ) : null}

          {selected && context ? (
            <>
              <AssetSummary
                asset={selected}
                href={`/prestocks/${selected.symbol}?opportunity=${opportunity.id}`}
                actionLabel="Open PreStocks asset"
              />
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Labeled comparison
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {context.limitation}
                </p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[32rem] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-2 pr-3 font-medium">Field</th>
                        <th className="py-2 pr-3 font-medium">Submitted opportunity</th>
                        <th className="py-2 font-medium">PreStocks catalog</th>
                      </tr>
                    </thead>
                    <tbody>
                      {context.rows.map((row) => (
                        <tr key={row.label} className="border-b border-border align-top">
                          <td className="py-2 pr-3 text-muted-foreground">{row.label}</td>
                          <td className="py-2 pr-3 break-words text-foreground">
                            {row.submitted}
                          </td>
                          <td className="py-2 break-words text-foreground">{row.market}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
