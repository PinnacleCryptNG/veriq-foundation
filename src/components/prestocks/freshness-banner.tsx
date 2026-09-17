import { Banner } from "@/components/feedback";
import type { Freshness } from "@/lib/prestocks/schema";
import { formatDateTime } from "@/lib/format";

export function FreshnessBanner({
  freshness,
  retrievedAt,
  servedAt,
  sourceUrl,
  warning,
}: {
  freshness: Freshness;
  retrievedAt: string | null;
  servedAt: string;
  sourceUrl: string;
  warning: string | null;
}) {
  const retrieved = retrievedAt ? formatDateTime(retrievedAt) : "not retrieved";
  const served = formatDateTime(servedAt);

  if (freshness === "unavailable") {
    return (
      <Banner tone="danger">
        PreStocks catalog unavailable. {warning ?? "No market figures are shown."}{" "}
        Source attempted: {sourceUrl}. Opportunity records were not changed.
      </Banner>
    );
  }

  if (freshness === "stale") {
    return (
      <Banner tone="danger">
        Stale PreStocks snapshot — not live data. VERIQ last retrieved it at{" "}
        {retrieved}; shown at {served}. {warning} Missing live data was not
        replaced with invented prices.
      </Banner>
    );
  }

  if (freshness === "cached") {
    return (
      <Banner>
        Cached PreStocks snapshot — not a new live fetch. VERIQ retrieved it at{" "}
        {retrieved}; shown at {served}. {warning} Source: {sourceUrl}. The
        payload has no exchange timestamp.
      </Banner>
    );
  }

  return (
    <Banner>
      Live PreStocks catalog. VERIQ retrieved this snapshot at {retrieved}.
      That is not an exchange or market-data timestamp — the PreStocks payload
      does not include one. Source: {sourceUrl}.
      {warning ? ` ${warning}` : ""}
    </Banner>
  );
}
