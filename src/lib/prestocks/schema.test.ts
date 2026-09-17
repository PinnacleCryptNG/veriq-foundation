import { describe, expect, it } from "vitest";
import { prestocksAssetSchema, prestocksCatalogSchema } from "@/lib/prestocks/schema";
import { samplePreStocksAsset } from "@/lib/prestocks/fixtures";

describe("PreStocks catalog schema", () => {
  it("accepts the official catalog object shape", () => {
    expect(prestocksAssetSchema.parse(samplePreStocksAsset).symbol).toBe("OPENAI");
    expect(prestocksCatalogSchema.parse([samplePreStocksAsset])).toHaveLength(1);
  });

  it("rejects a missing tokenPrice instead of inventing a figure", () => {
    const clone: Record<string, unknown> = { ...samplePreStocksAsset };
    delete clone.tokenPrice;
    expect(prestocksAssetSchema.safeParse(clone).success).toBe(false);
  });

  it("rejects a string price", () => {
    const parsed = prestocksAssetSchema.safeParse({
      ...samplePreStocksAsset,
      tokenPrice: "1033.23",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects a non-array catalog payload", () => {
    expect(prestocksCatalogSchema.safeParse({ assets: [samplePreStocksAsset] }).success).toBe(
      false,
    );
  });

  it("rejects an empty object", () => {
    expect(prestocksAssetSchema.safeParse({}).success).toBe(false);
  });
});
