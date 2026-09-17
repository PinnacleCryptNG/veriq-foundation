import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { OverviewOpportunityQueue } from "@/components/overview/opportunity-queue";
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
        title="Workspace"
        description="Compare private-market deal claims against submitted evidence. Intake and review runs stay in this browser."
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

      <LimitationNotice />
      <PersistenceNotice />
      <DemoWalkthroughHint surface="overview" />
      <DemoScenarioNotice />

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-foreground">Purpose</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {siteConfig.description} Capture an opportunity, enter structured
            evidence values, and run deterministic checks. Findings compare
            entered claims with entered values. They are not independent
            verification.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-foreground">Workspace status</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>Intake and local persistence are enabled.</li>
            <li>Evidence records and review runs stay in this browser only.</li>
            <li>Review findings are not a verified, safe, or approved result.</li>
          </ul>
        </div>
      </section>

      <ReviewSurfaceGrid />
      <OverviewOpportunityQueue />
    </PageContainer>
  );
}
