"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState, LoadingState } from "@/components/feedback";
import { Field } from "@/components/field";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { AssetSummary } from "@/components/prestocks/asset-summary";
import { FreshnessBanner } from "@/components/prestocks/freshness-banner";
import { PreStocksNotice } from "@/components/prestocks/prestocks-notice";
import { useOpportunities } from "@/hooks/use-opportunities";
import { usePreStocksCatalog } from "@/hooks/use-prestocks-catalog";
import { filterPreStocksAssets } from "@/lib/prestocks/match";
import { Button } from "@/components/ui/button";
import { useMarketReference } from "@/hooks/use-market-reference";

export function PreStocksCatalogWorkspace() {
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunity") ?? "";
  const { getById } = useOpportunities();
  const opportunity = opportunityId ? getById(opportunityId) : undefined;
  const { result, isLoading, reload } = usePreStocksCatalog();
  const reference = useMarketReference(opportunityId);
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () => filterPreStocksAssets(result.assets, query),
    [query, result.assets],
  );

  return (
    <PageContainer width="6xl">
      <PageHeader
        title="PreStocks catalog"
        description="Read-only market reference from the official PreStocks catalog. Browse tokens, then attach one as context on an opportunity. This is not trading, custody, or a review finding."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => void reload()}>
              Refresh catalog
            </Button>
            {opportunity ? (
              <LinkButton href={`/opportunities/${opportunity.id}`} variant="outline">
                Back to {opportunity.companyName}
              </LinkButton>
            ) : (
              <LinkButton href="/opportunities" variant="outline">
                Back to opportunities
              </LinkButton>
            )}
          </div>
        }
      />
      <PreStocksNotice />
      {isLoading ? (
        <LoadingState label="Loading PreStocks catalog…" />
      ) : (
        <>
          <FreshnessBanner
            freshness={result.freshness}
            retrievedAt={result.retrievedAt}
            servedAt={result.servedAt}
            sourceUrl={result.sourceUrl}
            warning={result.warning}
          />
          {result.ok || result.assets.length > 0 ? (
            <>
              <Field id="prestocks-search" label="Search catalog">
                <Input
                  id="prestocks-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Symbol, name, or contract address"
                />
              </Field>
              {visible.length === 0 ? (
                <EmptyState
                  title={
                    result.assets.length === 0
                      ? "No PreStocks assets in this snapshot"
                      : "No catalog rows match this search"
                  }
                  description={
                    result.assets.length === 0
                      ? "The catalog request did not include any assets. Missing data is not replaced with a placeholder price."
                      : "Clear the search to see every asset in the retrieved snapshot."
                  }
                />
              ) : (
                <ul className="grid gap-3 lg:grid-cols-2">
                  {visible.map((asset) => (
                    <li key={asset.symbol} className="space-y-2">
                      <AssetSummary
                        asset={asset}
                        href={
                          opportunity
                            ? `/prestocks/${asset.symbol}?opportunity=${opportunity.id}`
                            : `/prestocks/${asset.symbol}`
                        }
                        actionLabel="View market information"
                      />
                      {opportunity ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => reference.select(asset.symbol)}
                        >
                          Use as reference for {opportunity.companyName}
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <EmptyState
              title="PreStocks catalog unavailable"
              description="No market figures are shown. Missing prices are not invented."
              actions={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void reload()}
                >
                  Refresh catalog
                </Button>
              }
            />
          )}
        </>
      )}
    </PageContainer>
  );
}
