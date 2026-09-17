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
        Stale PreStocks snapshot. Retrieved {retrieved}; shown at {served}.{" "}
        {warning} This is labeled stale on purpose. Missing live data was not
        replaced silently.
      </Banner>
    );
  }

  if (freshness === "cached") {
    return (
      <Banner>
        Cached PreStocks snapshot. Retrieved {retrieved}; shown at {served}.{" "}
        {warning} Source: {sourceUrl}.
      </Banner>
    );
  }

  return (
    <Banner>
      Live PreStocks catalog. Retrieved {retrieved}. Source: {sourceUrl}.
      {warning ? ` ${warning}` : ""}
    </Banner>
  );
}
