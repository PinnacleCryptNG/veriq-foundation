import { fetchPreStocksCatalog } from "@/lib/prestocks/client";
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

export async function GET(request: Request) {
  const forceRefresh = new URL(request.url).searchParams.get("refresh") === "1";
  const result = prestocksCatalogResultSchema.parse(
    await fetchPreStocksCatalog({ forceRefresh }),
  );
  return jsonResult(result, result.ok ? 200 : 502);
}
