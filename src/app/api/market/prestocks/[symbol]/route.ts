import { fetchPreStocksCatalog, findAssetBySymbol } from "@/lib/prestocks/client";
import { prestocksCatalogResultSchema } from "@/lib/prestocks/schema";

export const dynamic = "force-dynamic";

function jsonResult(
  result: ReturnType<typeof prestocksCatalogResultSchema.parse>,
  status: number,
) {
  return Response.json(result, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await context.params;
  const forceRefresh = new URL(request.url).searchParams.get("refresh") === "1";
  const catalog = prestocksCatalogResultSchema.parse(
    await fetchPreStocksCatalog({ forceRefresh }),
  );
  const asset = findAssetBySymbol(catalog.assets, symbol);
  const missing = `No PreStocks asset with symbol ${symbol.trim().toUpperCase()} is in the retrieved catalog. This app does not call an undocumented per-asset PreStocks endpoint.`;

  if (!asset) {
    return jsonResult(
      {
        ...catalog,
        assets: [],
        warning: catalog.warning ? `${catalog.warning} ${missing}` : missing,
      },
      catalog.ok ? 404 : 502,
    );
  }

  return jsonResult(
    {
      ...catalog,
      assets: [asset],
    },
    200,
  );
}
