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
    <article className="rounded-lg border border-border bg-card p-4">
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
          <h3 className="text-sm font-medium text-foreground">{asset.name}</h3>
          <p className="text-xs text-muted-foreground">{asset.symbol}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {asset.description}
          </p>
        </div>
      </div>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
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
      <p className="mt-2 text-xs text-muted-foreground">
        PreStocks token prices track underlying SPVs holding private shares.
        Shown as secondary market benchmark context only.
      </p>
      {href ? (
        <div className="mt-3">
          <LinkButton href={href} size="sm">
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
        className={`mt-0.5 text-sm break-all text-foreground ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
