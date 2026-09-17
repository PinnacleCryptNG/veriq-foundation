"use client";

import { LinkButton } from "@/components/link-button";
import { Banner, LoadingState } from "@/components/feedback";
import {
  OpportunityCards,
  OpportunityTable,
} from "@/components/opportunities/opportunity-list";
import { useOpportunities } from "@/hooks/use-opportunities";

export function OverviewOpportunityQueue() {
  const { opportunities, isLoading, warning } = useOpportunities();

  if (isLoading) {
    return <LoadingState label="Loading opportunity queue…" />;
  }

  return (
    <section aria-labelledby="queue-heading" className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2
            id="queue-heading"
            className="text-sm font-medium text-foreground"
          >
            Opportunity queue
          </h2>
          <p className="text-sm text-muted-foreground">
            {opportunities.length} records. Status describes intake progress,
            not a verification result.
          </p>
        </div>
        <LinkButton href="/opportunities" variant="outline" size="sm">
          View all opportunities
        </LinkButton>
      </div>
      {warning ? <Banner>{warning}</Banner> : null}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
        <OpportunityTable opportunities={opportunities} />
      </div>
      <div className="md:hidden">
        <OpportunityCards opportunities={opportunities} />
      </div>
    </section>
  );
}
