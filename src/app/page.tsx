import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { HomepageHero } from "@/components/overview/homepage-hero";
import { VerificationFlowVisual } from "@/components/overview/verification-flow-visual";
import { HowItWorksSection } from "@/components/overview/how-it-works-section";
import { ReviewSurfaceGrid } from "@/components/overview/review-surface-grid";
import { PreStocksMarketContextCard } from "@/components/overview/prestocks-market-context-card";
import { OverviewOpportunityQueue } from "@/components/overview/opportunity-queue";
import { ProductBriefing } from "@/components/overview/product-briefing";
import { LimitationNotice } from "@/components/limitation-notice";
import { PersistenceNotice } from "@/components/persistence-notice";

export const metadata: Metadata = {
  title: "Verify Private Equity Deals Before Buying",
};

export default function OverviewPage() {
  return (
    <PageContainer width="6xl" className="space-y-10 sm:space-y-12">
      {/* 1. Clear, Buyer-Focused Hero */}
      <HomepageHero />

      {/* 2. Above-the-fold Claim -> Evidence -> Result visual */}
      <VerificationFlowVisual />

      {/* 3. 3-step How It Works */}
      <HowItWorksSection />

      {/* 4. Implemented 5 Deterministic Checks */}
      <ReviewSurfaceGrid />

      {/* 5. PreStocks as Secondary Market Context */}
      <div className="space-y-3">
        <PreStocksMarketContextCard />
      </div>

      {/* 6. Opportunity Queue (Fast access to Lumen Harbor & locally created opportunities) */}
      <OverviewOpportunityQueue />

      {/* 7. Footer notices and collapsible technical specifications */}
      <section className="space-y-3 pt-4 border-t border-border/80">
        <ProductBriefing compact />
        <div className="grid gap-3 sm:grid-cols-2">
          <LimitationNotice />
          <PersistenceNotice />
        </div>
      </section>
    </PageContainer>
  );
}
