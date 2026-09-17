import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DemoNotice } from "@/components/demo-notice";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { OverviewOpportunityQueue } from "@/components/overview/opportunity-queue";
import { ReviewSurfaceGrid } from "@/components/overview/review-surface-grid";
import { VerificationNotice } from "@/components/verification-notice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Workspace"
        description="Compare private-market deal claims against submitted evidence. Intake is local to this browser. Verification has not been run."
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
      <VerificationNotice />
      <PersistenceNotice />
      <DemoNotice />

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-medium text-foreground">Purpose</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {siteConfig.description} Capture an opportunity, attach evidence
            metadata, and inspect the record. No automated findings are produced
            in this milestone.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-foreground">Workspace status</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>Intake and local persistence are enabled.</li>
            <li>Evidence records are stored in this browser only.</li>
            <li>No opportunity has been verified.</li>
          </ul>
        </div>
      </section>

      <ReviewSurfaceGrid />
      <OverviewOpportunityQueue />
    </div>
  );
}
