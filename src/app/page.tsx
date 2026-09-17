import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DemoNotice } from "@/components/demo-notice";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import { OpportunityTable } from "@/components/opportunities/opportunity-list";
import { StatusBadge } from "@/components/opportunities/status-badge";
import { ReviewSurfaceGrid } from "@/components/overview/review-surface-grid";
import { siteConfig } from "@/config/site";
import { demoOpportunities } from "@/data/demo-opportunities";
import { formatDate, instrumentLabels } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Workspace"
        description="Compare private-market deal claims against submitted evidence. This build is the application shell only — no review has been run."
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
      <DemoNotice />

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-foreground">Purpose</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {siteConfig.description} Use the opportunities list to inspect
            labeled demo records, or open intake to see the fields the future
            creation flow will collect.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-foreground">Foundation status</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>Routes and navigation are live.</li>
            <li>Intake submission is not enabled.</li>
            <li>No opportunity has been verified.</li>
          </ul>
        </div>
      </section>

      <ReviewSurfaceGrid />

      <section aria-labelledby="demo-queue-heading" className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2
              id="demo-queue-heading"
              className="text-sm font-medium tracking-wide text-foreground uppercase"
            >
              Demo opportunity queue
            </h2>
            <p className="text-sm text-muted-foreground">
              {demoOpportunities.length} seeded records. Status describes intake
              progress, not a verification result.
            </p>
          </div>
          <LinkButton href="/opportunities" variant="outline" size="sm">
            View all opportunities
          </LinkButton>
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
          <OpportunityTable opportunities={demoOpportunities} />
        </div>

        <ul className="space-y-3 md:hidden">
          {demoOpportunities.map((opportunity) => (
            <li
              key={opportunity.id}
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{opportunity.companyName}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {instrumentLabels[opportunity.instrument]}
                  </p>
                </div>
                <StatusBadge status={opportunity.status} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Updated {formatDate(opportunity.updatedAt)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
