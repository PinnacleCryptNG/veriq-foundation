export const PRESTOCKS_OFFICIAL_CATALOG_URL =
  "https://prestocks.com/api/prestocks";

export function prestocksCatalogUrl(): string {
  const configured = process.env.PRESTOCKS_API_URL?.trim();
  return configured && configured.length > 0
    ? configured
    : PRESTOCKS_OFFICIAL_CATALOG_URL;
}
