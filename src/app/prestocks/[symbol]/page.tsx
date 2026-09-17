import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/feedback";
import { PageContainer } from "@/components/page-container";
import { PreStocksAssetWorkspace } from "@/components/prestocks/asset-workspace";

export const metadata: Metadata = {
  title: "PreStocks asset",
};

export default async function PreStocksAssetPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  return (
    <Suspense
      fallback={
        <PageContainer>
          <LoadingState label="Loading PreStocks asset…" />
        </PageContainer>
      }
    >
      <PreStocksAssetWorkspace symbol={symbol} />
    </Suspense>
  );
}
