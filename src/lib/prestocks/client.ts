import {
  CACHE_TTL_MS,
  FETCH_TIMEOUT_MS,
} from "@/config/prestocks";
import { prestocksCatalogUrl } from "@/config/prestocks.server";
import {
  prestocksCatalogSchema,
  type PreStocksCatalog,
  type PreStocksCatalogResult,
} from "@/lib/prestocks/schema";

export type FetchLike = (
  url: string,
  init?: RequestInit,
) => Promise<Response>;

type CacheEntry = {
  assets: PreStocksCatalog;
  retrievedAt: string;
  fetchedAtMs: number;
  sourceUrl: string;
};

let cache: CacheEntry | null = null;

export function resetPreStocksCache() {
  cache = null;
}

function iso(nowMs: number): string {
  return new Date(nowMs).toISOString();
}

function unavailable(
  sourceUrl: string,
  nowMs: number,
  warning: string,
): PreStocksCatalogResult {
  return {
    ok: false,
    assets: [],
    retrievedAt: null,
    servedAt: iso(nowMs),
    freshness: "unavailable",
    sourceUrl,
    warning,
  };
}

function fromCache(
  entry: CacheEntry,
  nowMs: number,
  freshness: "cached" | "stale",
  warning: string | null,
): PreStocksCatalogResult {
  return {
    ok: true,
    assets: entry.assets,
    retrievedAt: entry.retrievedAt,
    servedAt: iso(nowMs),
    freshness,
    sourceUrl: entry.sourceUrl,
    warning,
  };
}

export async function fetchPreStocksCatalog(options?: {
  fetcher?: FetchLike;
  now?: () => number;
  cacheTtlMs?: number;
  catalogUrl?: string;
  forceRefresh?: boolean;
}): Promise<PreStocksCatalogResult> {
  const nowMs = options?.now?.() ?? Date.now();
  const sourceUrl = options?.catalogUrl ?? prestocksCatalogUrl();
  const ttl = options?.cacheTtlMs ?? CACHE_TTL_MS;
  const fetcher = options?.fetcher ?? fetch;

  if (!options?.forceRefresh && cache && nowMs - cache.fetchedAtMs < ttl) {
    return fromCache(
      cache,
      nowMs,
      "cached",
      `Showing a catalog snapshot retrieved at ${cache.retrievedAt}. Live PreStocks data was not requested again because this snapshot is within the ${ttl / 1000}-second cache window.`,
    );
  }

  try {
    const response = await fetcher(sourceUrl, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      if (cache) {
        return fromCache(
          cache,
          nowMs,
          "stale",
          `Live PreStocks request failed (HTTP ${response.status}). Showing the last retrieved catalog from ${cache.retrievedAt}. This snapshot may be out of date.`,
        );
      }
      return unavailable(
        sourceUrl,
        nowMs,
        `PreStocks catalog request failed (HTTP ${response.status}). No earlier snapshot is available.`,
      );
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      if (cache) {
        return fromCache(
          cache,
          nowMs,
          "stale",
          `PreStocks returned a body that was not JSON. Showing the last retrieved catalog from ${cache.retrievedAt}. This snapshot may be out of date.`,
        );
      }
      return unavailable(
        sourceUrl,
        nowMs,
        "PreStocks returned a body that was not JSON. No catalog is shown.",
      );
    }

    const parsed = prestocksCatalogSchema.safeParse(payload);
    if (!parsed.success) {
      if (cache) {
        return fromCache(
          cache,
          nowMs,
          "stale",
          `PreStocks returned a catalog that did not match the known schema. Showing the last retrieved catalog from ${cache.retrievedAt}. This snapshot may be out of date.`,
        );
      }
      return unavailable(
        sourceUrl,
        nowMs,
        "PreStocks returned a catalog that did not match the known schema. No catalog is shown.",
      );
    }

    const retrievedAt = iso(nowMs);
    cache = {
      assets: parsed.data,
      retrievedAt,
      fetchedAtMs: nowMs,
      sourceUrl,
    };

    return {
      ok: true,
      assets: parsed.data,
      retrievedAt,
      servedAt: retrievedAt,
      freshness: "live",
      sourceUrl,
      warning:
        parsed.data.length === 0
          ? "PreStocks returned an empty catalog. That is not a review finding."
          : null,
    };
  } catch {
    if (cache) {
      return fromCache(
        cache,
        nowMs,
        "stale",
        `The live PreStocks request did not complete. Showing the last retrieved catalog from ${cache.retrievedAt}. This snapshot may be out of date.`,
      );
    }
    return unavailable(
      sourceUrl,
      nowMs,
      "The PreStocks catalog could not be retrieved. No earlier snapshot is available.",
    );
  }
}

export function findAssetBySymbol(
  assets: PreStocksCatalog,
  symbol: string,
) {
  const wanted = symbol.trim().toUpperCase();
  return assets.find((asset) => asset.symbol.toUpperCase() === wanted);
}
