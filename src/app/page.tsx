import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { OverviewOpportunityQueue } from "@/components/overview/opportunity-queue";
import { ProductBriefing } from "@/components/overview/product-briefing";
import { ReviewSurfaceGrid } from "@/components/overview/review-surface-grid";
import { DemoScenarioNotice } from "@/components/review/demo-scenario-notice";
import { DemoWalkthroughHint } from "@/components/review/demo-walkthrough-hint";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <PageContainer width="6xl">
      <PageHeader
        title="Overview"
        description={`${siteConfig.tagline}. Capture claimed terms, enter structured evidence, and run deterministic checks in this browser. Findings are comparisons of entered values, not independent verification.`}
        actions={
          <>
            <LinkButton href="/opportunities" variant="outline">
              Open opportunities
            </LinkButton>
            <LinkButton href="/opportunities/new">
              New opportunity
              <ArrowRight data-icon="inline-end" />
            </LinkButton>
          </>
        }
      />

      <ProductBriefing />
      <LimitationNotice />
      <PersistenceNotice />
      <DemoWalkthroughHint surface="overview" />
      <DemoScenarioNotice />

      <ReviewSurfaceGrid />
      <OverviewOpportunityQueue />
    </PageContainer>
  );
}
