"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, FolderArchive } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { Banner, EmptyState, LoadingState } from "@/components/feedback";
import {
  OpportunityCards,
  OpportunityTable,
} from "@/components/opportunities/opportunity-list";
import { useOpportunities } from "@/hooks/use-opportunities";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";

export function OverviewOpportunityQueue() {
  const { opportunities, isLoading, warning } = useOpportunities();

  // Highlight Lumen Harbor as the featured guided demo opportunity
  const lumenDemo = opportunities.find((opp) => opp.id === DEMO_SCENARIO_ID);
  const otherOpportunities = opportunities.filter((opp) => opp.id !== DEMO_SCENARIO_ID);

  return (
    <section aria-labelledby="queue-heading" className="space-y-6">
      {/* Featured Guided Demo Card */}
      <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card/70 to-card/50 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3" />
                Featured Guided Demo
              </span>
              <span className="text-xs text-muted-foreground">
                Synthetic scenario · Ready to run
              </span>
            </div>
            <h2 id="queue-heading" className="text-lg font-bold text-foreground">
              {lumenDemo ? lumenDemo.companyName : "Lumen Harbor Analytics"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <LinkButton
              href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
              size="sm"
              className="font-semibold shadow-sm"
            >
              Run the 2-minute demo now
              <ArrowRight className="size-3.5" />
            </LinkButton>
            <LinkButton
              href={`/opportunities/${DEMO_SCENARIO_ID}`}
              variant="outline"
              size="sm"
            >
              Inspect opportunity
            </LinkButton>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
          Walk through 400 offered shares at $18.00. Run checks to instantly spot why underlying SPV agreements and omitted payment totals raise an immediate buyer alert.
        </p>

        {/* Clear next step after the demo */}
        <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">
            Finished reviewing Lumen Harbor?
          </span>
          <Link
            href="/opportunities/new"
            className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Now try your own deal check
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {warning ? <Banner>{warning}</Banner> : null}

      {/* Other opportunities / user created opportunities */}
      {isLoading ? (
        <LoadingState label="Loading opportunity queue…" />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No opportunities in this workspace"
          description="Create an opportunity to capture claimed terms. Seeded demo records should appear here unless storage data could not be read."
          actions={
            <LinkButton href="/opportunities/new">New opportunity</LinkButton>
          }
        />
      ) : (
        <details className="group rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60">
          <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
            <span className="flex items-center gap-2">
              <FolderArchive className="size-4 text-muted-foreground" />
              See more example deals
            </span>
            <span className="text-primary text-xs normal-case group-open:hidden">
              Show example deals →
            </span>
            <span className="text-muted-foreground text-xs normal-case hidden group-open:inline">
              Hide example deals ↑
            </span>
          </summary>

          <div className="mt-4 pt-3 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Secondary test packets and your locally saved deals.
              </p>
              <Link
                href="/opportunities"
                className="text-xs font-medium text-primary hover:underline"
              >
                Open full opportunities table →
              </Link>
            </div>

            <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
              <OpportunityTable opportunities={otherOpportunities} />
            </div>
            <div className="md:hidden">
              <OpportunityCards opportunities={otherOpportunities} />
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
