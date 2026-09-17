import { fetchPreStocksCatalog, findAssetBySymbol } from "@/lib/prestocks/client";
import { prestocksCatalogResultSchema } from "@/lib/prestocks/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await context.params;
  const catalog = prestocksCatalogResultSchema.parse(await fetchPreStocksCatalog());
  const asset = findAssetBySymbol(catalog.assets, symbol);

  if (!asset) {
    return Response.json(
      {
        ...catalog,
        ok: catalog.ok,
        assets: [],
        warning:
          catalog.warning ??
          `No PreStocks asset with symbol ${symbol.trim().toUpperCase()} is in the retrieved catalog. This app does not call an undocumented per-asset PreStocks endpoint.`,
      },
      { status: catalog.ok ? 404 : 502 },
    );
  }

  return Response.json(
    {
      ...catalog,
      assets: [asset],
    },
    { status: 200 },
  );
}
