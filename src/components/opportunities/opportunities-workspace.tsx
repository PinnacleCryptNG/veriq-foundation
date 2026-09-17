"use client";

import { DemoNotice } from "@/components/demo-notice";
import { EmptyState, LoadingState, Banner } from "@/components/feedback";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { VerificationNotice } from "@/components/verification-notice";
import {
  OpportunityCards,
  OpportunityTable,
} from "@/components/opportunities/opportunity-list";
import { useOpportunities } from "@/hooks/use-opportunities";

export function OpportunitiesWorkspace() {
  const { opportunities, isLoading, warning, persistError } = useOpportunities();
  const demoCount = opportunities.filter((opportunity) => opportunity.isDemo).length;
  const createdCount = opportunities.length - demoCount;

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
      <VerificationNotice />
      <PersistenceNotice />
      <DemoNotice />
      {warning ? <Banner>{warning}</Banner> : null}
      {persistError ? <Banner tone="danger">{persistError}</Banner> : null}

      {isLoading ? (
        <LoadingState label="Loading opportunities…" />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities in this workspace"
          description="Create an opportunity to capture claimed terms. Seeded demo records should appear here unless storage data could not be read."
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {opportunities.length} records ({demoCount} demo, {createdCount}{" "}
            created in this browser). Evidence counts are local records, not
            authenticated documents.
          </p>
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
            <OpportunityTable opportunities={opportunities} />
          </div>
          <div className="md:hidden">
            <OpportunityCards opportunities={opportunities} />
          </div>
        </>
      )}
    </div>
  );
}
