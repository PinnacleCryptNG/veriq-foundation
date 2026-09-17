import type { Metadata } from "next";
import { DemoNotice } from "@/components/demo-notice";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import {
  OpportunityCards,
  OpportunityTable,
} from "@/components/opportunities/opportunity-list";
import { demoOpportunities } from "@/data/demo-opportunities";

export const metadata: Metadata = {
  title: "Opportunities",
};

export default function OpportunitiesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Opportunities"
        description="Private-market records captured for review. Status tracks intake and evidence collection only — none of these items have been verified."
        actions={
          <LinkButton href="/opportunities/new">New opportunity</LinkButton>
        }
      />

      <LimitationNotice />
      <DemoNotice />

      {demoOpportunities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">
            No opportunities in this workspace
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Intake is not enabled in this foundation build. Demo records should
            appear here when seeded.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {demoOpportunities.length} demo records. Materials on file are
            unlabeled documents, not authenticated evidence.
          </p>
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
            <OpportunityTable opportunities={demoOpportunities} />
          </div>
          <div className="md:hidden">
            <OpportunityCards opportunities={demoOpportunities} />
          </div>
        </>
      )}
    </div>
  );
}
