"use client";

import { useState } from "react";
import { EmptyState, LoadingState, Banner } from "@/components/feedback";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { LimitationNotice } from "@/components/limitation-notice";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import {
  OpportunityCards,
  OpportunityTable,
} from "@/components/opportunities/opportunity-list";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Sparkles, Filter, Info } from "lucide-react";

export function OpportunitiesWorkspace() {
  const { opportunities, isLoading, warning, persistError } = useOpportunities();
  const [filterMode, setFilterMode] = useState<"all" | "examples" | "my-deals">("all");

  const demoCount = opportunities.filter((opportunity) => opportunity.isDemo).length;
  const createdCount = opportunities.length - demoCount;

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterMode === "examples") return opp.isDemo;
    if (filterMode === "my-deals") return !opp.isDemo;
    return true;
  });

  return (
    <PageContainer width="6xl" className="space-y-6">
      {/* 36. Value-led title and introduction */}
      <PageHeader
        title="Private-Market Deals"
        description="Review seller claims, manage entered evidence records, and run deterministic verification checks before committing capital."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <LinkButton
              href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
              variant="outline"
            >
              <Sparkles className="size-3.5 text-primary mr-1" />
              Run Lumen demo
            </LinkButton>
            <LinkButton href="/opportunities/new">
              Start a new deal check
            </LinkButton>
          </div>
        }
      />

      {/* 37. Single strong limitations notice */}
      <LimitationNotice />

      {warning ? <Banner>{warning}</Banner> : null}
      {persistError ? <Banner tone="danger">{persistError}</Banner> : null}

      {/* 38. Filter and quick-start demo banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3.5 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">Filter deals:</span>
          <div className="flex rounded-md border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                filterMode === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({opportunities.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("examples")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                filterMode === "examples"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Example deals ({demoCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("my-deals")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                filterMode === "my-deals"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My deals ({createdCount})
            </button>
          </div>
        </div>

        <span className="text-muted-foreground">
          Showing {filteredOpportunities.length} of {opportunities.length} total deal records
        </span>
      </div>

      {isLoading ? (
        <LoadingState label="Loading deals…" />
      ) : opportunities.length === 0 ? (
        /* 43. Helpful empty state explaining what to do next and offering guided demo */
        <EmptyState
          title="No deals in this workspace yet"
          description="Ready to check a deal? You can test the verification engine using our pre-seeded guided demo or enter your first private-share transaction."
          actions={
            <div className="flex flex-wrap gap-2">
              <LinkButton href={`/opportunities/${DEMO_SCENARIO_ID}/review`}>
                Run the Lumen Harbor demo
              </LinkButton>
              <LinkButton href="/opportunities/new" variant="outline">
                Start a new deal check
              </LinkButton>
            </div>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
            <OpportunityTable opportunities={filteredOpportunities} />
          </div>
          <div className="md:hidden">
            <OpportunityCards opportunities={filteredOpportunities} />
          </div>

          {/* 40. Compact status guide legend */}
          <details className="group rounded-xl border border-border bg-card/40 p-3.5 transition-colors hover:bg-card/60">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-1.5">
                <Info className="size-3.5 text-primary" />
                Deal intake status legend (what each label means)
              </span>
              <span className="text-primary text-[11px] group-open:hidden">
                Show status guide →
              </span>
              <span className="text-muted-foreground text-[11px] hidden group-open:inline">
                Hide status guide ↑
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-border/60 grid gap-2 sm:grid-cols-3 text-xs">
              <div className="rounded border border-border/70 bg-background/50 p-2.5 space-y-1">
                <span className="font-semibold text-foreground">Intake incomplete</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Required basic terms (company, offered security, pricing) are still being entered.
                </p>
              </div>
              <div className="rounded border border-border/70 bg-background/50 p-2.5 space-y-1">
                <span className="font-semibold text-foreground">Evidence pending</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Basic pitch is recorded, but supporting documents (transfer agreements, worksheets) are waiting to be attached.
                </p>
              </div>
              <div className="rounded border border-border/70 bg-background/50 p-2.5 space-y-1">
                <span className="font-semibold text-foreground">Queued for review</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Claims and evidence are recorded in the workspace and ready for the 5-point verification checks.
                </p>
              </div>
            </div>
          </details>
        </>
      )}
    </PageContainer>
  );
}
