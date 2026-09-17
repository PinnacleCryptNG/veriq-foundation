"use client";

import { EmptyState, LoadingState, Banner } from "@/components/feedback";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { DemoScenarioNotice } from "@/components/review/demo-scenario-notice";
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
    <PageContainer width="6xl">
      <PageHeader
        title="Opportunities"
        description="Private-market records captured for review. Status tracks intake and evidence collection only. It is not a verification verdict."
        actions={
          <LinkButton href="/opportunities/new">New opportunity</LinkButton>
        }
      />

      <LimitationNotice />
      <PersistenceNotice />
      <DemoScenarioNotice />
      {warning ? <Banner>{warning}</Banner> : null}
      {persistError ? <Banner tone="danger">{persistError}</Banner> : null}

      {isLoading ? (
        <LoadingState label="Loading opportunities…" />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities in this workspace"
          description="Create an opportunity to capture claimed terms. Seeded demo records should appear here unless storage data could not be read."
          actions={
            <LinkButton href="/opportunities/new">New opportunity</LinkButton>
          }
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {opportunities.length} records ({demoCount} demo, {createdCount}{" "}
            created in this browser). Evidence counts are local records, not
            authenticated documents.
          </p>
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
            <OpportunityTable opportunities={opportunities} />
          </div>
          <div className="md:hidden">
            <OpportunityCards opportunities={opportunities} />
          </div>
        </>
      )}
    </PageContainer>
  );
}
