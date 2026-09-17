import { afterEach, describe, expect, it } from "vitest";
import {
  fetchPreStocksCatalog,
  findAssetBySymbol,
  resetPreStocksCache,
} from "@/lib/prestocks/client";
import { samplePreStocksAsset } from "@/lib/prestocks/fixtures";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  resetPreStocksCache();
});

describe("PreStocks catalog client", () => {
  it("returns live assets from a valid catalog", async () => {
    const result = await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse([samplePreStocksAsset]),
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
    });
    expect(result.ok).toBe(true);
    expect(result.freshness).toBe("live");
    expect(result.assets[0]?.symbol).toBe("OPENAI");
    expect(result.retrievedAt).toBe("2026-09-17T12:00:00.000Z");
    expect(result.warning).toBeNull();
  });

  it("returns a labeled cached snapshot inside the TTL window", async () => {
    const fetcher = async () => jsonResponse([samplePreStocksAsset]);
    await fetchPreStocksCatalog({
      fetcher,
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
      cacheTtlMs: 30_000,
    });
    let calls = 0;
    const result = await fetchPreStocksCatalog({
      fetcher: async () => {
        calls += 1;
        return jsonResponse([samplePreStocksAsset]);
      },
      now: () => Date.parse("2026-09-17T12:00:10.000Z"),
      cacheTtlMs: 30_000,
    });
    expect(calls).toBe(0);
    expect(result.freshness).toBe("cached");
    expect(result.retrievedAt).toBe("2026-09-17T12:00:00.000Z");
    expect(result.warning).toMatch(/cache window/i);
  });

  it("labels a previous snapshot stale when a later fetch fails", async () => {
    await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse([samplePreStocksAsset]),
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
      cacheTtlMs: 1,
    });
    const result = await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse({ error: "nope" }, 503),
      now: () => Date.parse("2026-09-17T12:05:00.000Z"),
      cacheTtlMs: 1,
    });
    expect(result.ok).toBe(true);
    expect(result.freshness).toBe("stale");
    expect(result.assets[0]?.symbol).toBe("OPENAI");
    expect(result.warning).toMatch(/stale|out of date|failed/i);
  });

  it("does not invent assets when the live catalog is malformed and no cache exists", async () => {
    const result = await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse({ tokenPrice: 1 }),
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
    });
    expect(result.ok).toBe(false);
    expect(result.freshness).toBe("unavailable");
    expect(result.assets).toEqual([]);
    expect(result.retrievedAt).toBeNull();
    expect(result.warning).toMatch(/schema|not shown/i);
  });

  it("treats an empty catalog as empty, not as missing prices to fill in", async () => {
    const result = await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse([]),
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
    });
    expect(result.ok).toBe(true);
    expect(result.assets).toEqual([]);
    expect(result.warning).toMatch(/empty catalog/i);
  });

  it("bypasses the cache window when forceRefresh is set", async () => {
    await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse([samplePreStocksAsset]),
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
      cacheTtlMs: 30_000,
    });
    let calls = 0;
    const result = await fetchPreStocksCatalog({
      forceRefresh: true,
      cacheTtlMs: 30_000,
      now: () => Date.parse("2026-09-17T12:00:10.000Z"),
      fetcher: async () => {
        calls += 1;
        return jsonResponse([
          { ...samplePreStocksAsset, tokenPrice: 1100.5 },
        ]);
      },
    });
    expect(calls).toBe(1);
    expect(result.freshness).toBe("live");
    expect(result.assets[0]?.tokenPrice).toBe(1100.5);
    expect(result.retrievedAt).toBe("2026-09-17T12:00:10.000Z");
  });

  it("keeps a failed force refresh labeled stale, not live", async () => {
    await fetchPreStocksCatalog({
      fetcher: async () => jsonResponse([samplePreStocksAsset]),
      now: () => Date.parse("2026-09-17T12:00:00.000Z"),
      cacheTtlMs: 30_000,
    });
    const result = await fetchPreStocksCatalog({
      forceRefresh: true,
      cacheTtlMs: 30_000,
      now: () => Date.parse("2026-09-17T12:00:10.000Z"),
      fetcher: async () => {
        throw new Error("network down");
      },
    });
    expect(result.ok).toBe(true);
    expect(result.freshness).toBe("stale");
    expect(result.assets[0]?.tokenPrice).toBe(samplePreStocksAsset.tokenPrice);
    expect(result.warning).toMatch(/out of date|did not complete/i);
  });

  it("selects a catalog row by symbol without calling another endpoint", () => {
    expect(
      findAssetBySymbol([samplePreStocksAsset], "openai")?.name,
    ).toBe("OpenAI PreStocks");
    expect(findAssetBySymbol([samplePreStocksAsset], "SPACEX")).toBeUndefined();
  });
});
