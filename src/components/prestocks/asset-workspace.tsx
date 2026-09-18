"use client";

import { useSearchParams } from "next/navigation";
import { EmptyState, LoadingState } from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { AssetSummary } from "@/components/prestocks/asset-summary";
import { FreshnessBanner } from "@/components/prestocks/freshness-banner";
import { PreStocksNotice } from "@/components/prestocks/prestocks-notice";
import { useMarketReference } from "@/hooks/use-market-reference";
import { useOpportunities } from "@/hooks/use-opportunities";
import { usePreStocksCatalog } from "@/hooks/use-prestocks-catalog";
import { formatCatalogNumber } from "@/lib/prestocks/context";
import { PRESTOCKS_PRODUCTS_URL } from "@/config/prestocks";

export function PreStocksAssetWorkspace({ symbol }: { symbol: string }) {
  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunity") ?? "";
  const { getById } = useOpportunities();
  const opportunity = opportunityId ? getById(opportunityId) : undefined;
  const { result, isLoading, reload } = usePreStocksCatalog(symbol);
  const reference = useMarketReference(opportunityId);
  const asset = result.assets[0];

  return (
    <PageContainer width="4xl">
      <PageHeader
        title={asset ? asset.name : `PreStocks · ${symbol.toUpperCase()}`}
        description="Official catalog fields for this token. Retrieval time is recorded by VERIQ. PreStocks does not include a market-data timestamp in this API payload."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => void reload()}>
              Refresh catalog
            </Button>
            <LinkButton
              href={
                opportunity
                  ? `/prestocks?opportunity=${opportunity.id}`
                  : "/prestocks"
              }
              variant="outline"
            >
              Back to catalog
            </LinkButton>
            {opportunity ? (
              <LinkButton href={`/opportunities/${opportunity.id}`}>
                Back to {opportunity.companyName}
              </LinkButton>
            ) : (
              <LinkButton href="/opportunities">Back to opportunities</LinkButton>
            )}
          </div>
        }
      />
      <PreStocksNotice />
      {isLoading ? (
        <LoadingState label="Loading PreStocks asset…" />
      ) : (
        <>
          <FreshnessBanner
            freshness={result.freshness}
            retrievedAt={result.retrievedAt}
            servedAt={result.servedAt}
            sourceUrl={result.sourceUrl}
            warning={result.warning}
          />
          {!asset ? (
            <EmptyState
              title="Asset not in this catalog snapshot"
              description="VERIQ only reads the official PreStocks catalog through the server market-reference route and selects a row by symbol. No other PreStocks endpoint is called. Missing rows are not filled with guessed prices."
              actions={
                <LinkButton
                  href={
                    opportunity
                      ? `/prestocks?opportunity=${opportunity.id}`
                      : "/prestocks"
                  }
                  variant="outline"
                >
                  Open catalog
                </LinkButton>
              }
            />
          ) : (
            <>
              <AssetSummary asset={asset} />
              <section className="rounded-lg border border-border bg-card p-4">
                <h2 className="text-sm font-medium text-foreground">
                  Provenance
                </h2>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      Catalog source
                    </dt>
                    <dd className="mt-0.5 text-sm break-all text-foreground">
                      {result.sourceUrl}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      Retrieved at
                    </dt>
                    <dd className="mt-0.5 text-sm text-foreground">
                      {result.retrievedAt ?? "Not retrieved"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      Freshness
                    </dt>
                    <dd className="mt-0.5 text-sm text-foreground">
                      {result.freshness}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      Market-data timestamp in payload
                    </dt>
                    <dd className="mt-0.5 text-sm text-foreground">
                      Not provided by this API
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      Official product page
                    </dt>
                    <dd className="mt-0.5 text-sm">
                      <a
                        href={asset.external_url}
                        className="text-foreground underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {asset.external_url}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
                      Products index
                    </dt>
                    <dd className="mt-0.5 text-sm">
                      <a
                        href={PRESTOCKS_PRODUCTS_URL}
                        className="text-foreground underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {PRESTOCKS_PRODUCTS_URL}
                      </a>
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  Comparing Token price (${formatCatalogNumber(asset.tokenPrice)}) with Mark price (${formatCatalogNumber(asset.markPrice)})
                  reflects the spread between latest secondary trading and recent benchmark marks. It is arithmetic on two API fields, not an investment rating or fairness conclusion.
                </p>
              </section>
              {opportunity ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => reference.select(asset.symbol)}
                  >
                    Use as reference for {opportunity.companyName}
                  </Button>
                  <LinkButton
                    href={`/opportunities/${opportunity.id}/review`}
                    variant="outline"
                  >
                    Return to review workspace
                  </LinkButton>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
