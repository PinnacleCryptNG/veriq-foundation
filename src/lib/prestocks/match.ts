import type { PreStocksAsset } from "@/lib/prestocks/schema";

export function normalizeCompanyQuery(value: string): string {
  return value
    .toLowerCase()
    .replace(/prestocks/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function suggestPreStocksMatches(
  companyName: string,
  assets: PreStocksAsset[],
): PreStocksAsset[] {
  const query = normalizeCompanyQuery(companyName);
  if (query.length === 0) {
    return [];
  }

  return assets.filter((asset) => {
    const name = normalizeCompanyQuery(asset.name);
    const symbol = asset.symbol.toLowerCase();
    return (
      query === symbol ||
      query === name ||
      query.includes(symbol) ||
      name.includes(query) ||
      query.includes(name)
    );
  });
}

export function filterPreStocksAssets(
  assets: PreStocksAsset[],
  search: string,
): PreStocksAsset[] {
  const query = normalizeCompanyQuery(search);
  if (query.length === 0) {
    return assets;
  }
  return assets.filter((asset) => {
    const haystack = normalizeCompanyQuery(
      `${asset.name} ${asset.symbol} ${asset.description} ${asset.contract_address}`,
    );
    return haystack.includes(query) || asset.symbol.toLowerCase().includes(query);
  });
}
