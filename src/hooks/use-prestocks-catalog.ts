"use client";

import { useCallback, useEffect, useState } from "react";
import {
  prestocksCatalogResultSchema,
  type PreStocksCatalogResult,
} from "@/lib/prestocks/schema";

const loadingResult: PreStocksCatalogResult = {
  ok: false,
  assets: [],
  retrievedAt: null,
  servedAt: new Date(0).toISOString(),
  freshness: "unavailable",
  sourceUrl: "/api/market/prestocks",
  warning: null,
};

function catalogPath(symbol?: string, refresh = false) {
  const path = symbol
    ? `/api/market/prestocks/${encodeURIComponent(symbol)}`
    : "/api/market/prestocks";
  return refresh ? `${path}?refresh=1` : path;
}

async function requestCatalog(path: string): Promise<PreStocksCatalogResult> {
  try {
    const response = await fetch(path, { cache: "no-store" });
    const payload: unknown = await response.json();
    const parsed = prestocksCatalogResultSchema.safeParse(payload);
    if (!parsed.success) {
      return {
        ok: false,
        assets: [],
        retrievedAt: null,
        servedAt: new Date().toISOString(),
        freshness: "unavailable",
        sourceUrl: path,
        warning:
          "The market-reference API returned a response that could not be validated. No PreStocks figures are shown.",
      };
    }
    return parsed.data;
  } catch {
    return {
      ok: false,
      assets: [],
      retrievedAt: null,
      servedAt: new Date().toISOString(),
      freshness: "unavailable",
      sourceUrl: path,
      warning:
        "The PreStocks catalog could not be loaded.",
    };
  }
}

export function usePreStocksCatalog(symbol?: string) {
  const [result, setResult] = useState<PreStocksCatalogResult>(loadingResult);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const path = catalogPath(symbol);
    void requestCatalog(path).then((next) => {
      if (!cancelled) {
        setResult(next);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const next = await requestCatalog(catalogPath(symbol, true));
    setResult(next);
    setIsLoading(false);
  }, [symbol]);

  return { result, isLoading, reload };
}
