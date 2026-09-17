import { fetchPreStocksCatalog } from "@/lib/prestocks/client";
import { prestocksCatalogResultSchema } from "@/lib/prestocks/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = prestocksCatalogResultSchema.parse(await fetchPreStocksCatalog());
  const status = result.ok ? 200 : 502;
  return Response.json(result, { status });
}
