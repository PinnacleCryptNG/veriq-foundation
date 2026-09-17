import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/feedback";
import { PageContainer } from "@/components/page-container";
import { PreStocksCatalogWorkspace } from "@/components/prestocks/catalog-workspace";

export const metadata: Metadata = {
  title: "PreStocks catalog",
};

export default function PreStocksPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <LoadingState label="Loading PreStocks catalog…" />
        </PageContainer>
      }
    >
      <PreStocksCatalogWorkspace />
    </Suspense>
  );
}
