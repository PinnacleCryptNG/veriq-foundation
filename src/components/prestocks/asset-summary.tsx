import { formatCatalogNumber } from "@/lib/prestocks/context";
import type { PreStocksAsset } from "@/lib/prestocks/schema";
import { LinkButton } from "@/components/link-button";

export function AssetSummary({
  asset,
  href,
  actionLabel,
}: {
  asset: PreStocksAsset;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.image}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-md border border-border object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{asset.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">{asset.symbol}</p>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground line-clamp-3">
            {asset.description}
          </p>
        </div>
      </div>

      {/* 47. Buyer-facing pricing values visible by default */}
      <dl className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-border/60">
        <Field
          label="Token price (tokenPrice)"
          value={`$${formatCatalogNumber(asset.tokenPrice)}`}
        />
        <Field
          label="Mark price (markPrice)"
          value={`$${formatCatalogNumber(asset.markPrice)}`}
        />
        <Field
          label="Implied valuation (impliedValuation)"
          value={`$${formatCatalogNumber(asset.impliedValuation)}`}
        />
        <Field
          label="Mark valuation (markValuation)"
          value={`$${formatCatalogNumber(asset.markValuation)}`}
        />
      </dl>

      {/* 47. Raw technical details behind progressive disclosure */}
      <details className="group rounded-lg border border-border/70 bg-background/50 p-2.5 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground flex items-center justify-between">
          <span>Show technical details (supply & contract)</span>
          <span className="text-[11px] text-primary group-open:hidden">Expand ↓</span>
          <span className="text-[11px] text-muted-foreground hidden group-open:inline">Hide ↑</span>
        </summary>
        <dl className="mt-2.5 pt-2 border-t border-border/60 grid gap-2">
          <Field
            label="Token supply (supply)"
            value={formatCatalogNumber(asset.supply)}
          />
          <Field
            label="Contract address"
            value={asset.contract_address}
            mono
          />
        </dl>
      </details>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        PreStocks token prices track underlying SPVs holding private shares.
        Shown as secondary market benchmark context only.
      </p>

      {href ? (
        <div className="pt-1">
          <LinkButton href={href} size="sm" variant="outline">
            {actionLabel ?? "Open asset"}
          </LinkButton>
        </div>
      ) : null}
    </article>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm break-all font-medium text-foreground ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
