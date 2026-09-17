import { z } from "zod";

export const prestocksAssetSchema = z.object({
  name: z.string().trim().min(1),
  symbol: z.string().trim().min(1),
  description: z.string().min(1),
  image: z.string().trim().min(1),
  external_url: z.string().trim().min(1),
  contract_address: z.string().trim().min(1),
  markPrice: z.number().finite(),
  markValuation: z.number().finite(),
  tokenPrice: z.number().finite(),
  impliedValuation: z.number().finite(),
  supply: z.number().finite(),
});

export const prestocksCatalogSchema = z.array(prestocksAssetSchema);

export const freshnessSchema = z.enum([
  "live",
  "cached",
  "stale",
  "unavailable",
]);

export const prestocksCatalogResultSchema = z.object({
  ok: z.boolean(),
  assets: z.array(prestocksAssetSchema),
  retrievedAt: z.iso.datetime().nullable(),
  servedAt: z.iso.datetime(),
  freshness: freshnessSchema,
  sourceUrl: z.string().min(1),
  warning: z.string().nullable(),
});

export type PreStocksAsset = z.infer<typeof prestocksAssetSchema>;
export type PreStocksCatalog = z.infer<typeof prestocksCatalogSchema>;
export type Freshness = z.infer<typeof freshnessSchema>;
export type PreStocksCatalogResult = z.infer<typeof prestocksCatalogResultSchema>;
