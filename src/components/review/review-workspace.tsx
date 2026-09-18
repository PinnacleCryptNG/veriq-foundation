"use client";

import { useMemo, useState } from "react";
import {
  Play,
  FileCheck,
  History,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { Banner, EmptyState, LoadingState } from "@/components/feedback";
import { DemoBadge } from "@/components/opportunities/demo-badge";
import { StatusBadge } from "@/components/opportunities/status-badge";
import { LinkButton } from "@/components/link-button";
import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { SectionHeading } from "@/components/section-heading";
import { DemoReviewNotice } from "@/components/review/demo-review-notice";
import { DemoScenarioNotice } from "@/components/review/demo-scenario-notice";
import { DemoWalkthroughHint } from "@/components/review/demo-walkthrough-hint";
import { FindingCard } from "@/components/review/finding-card";
import { PreStocksReferencePanel } from "@/components/prestocks/reference-panel";
import { FindingStateLegend } from "@/components/review/finding-state-legend";
import { ReviewReadiness } from "@/components/review/review-readiness";
import { ReviewReport } from "@/components/review/review-report";
import { Button } from "@/components/ui/button";
import { DEMO_SCENARIO_ID, isDemoScenario } from "@/data/demo-opportunities";
import { useOpportunities } from "@/hooks/use-opportunities";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { useVerificationRuns } from "@/hooks/use-verification-runs";
import { evaluateOpportunity } from "@/engine/run";
import { engineInputsMatch } from "@/lib/engine-input";
import { createId, nowIso } from "@/lib/ids";
import { toEngineInput } from "@/lib/to-engine-input";
import {
  formatClaimedPrice,
  formatDateTime,
  formatQuantity,
  instrumentLabels,
  verificationStateLabels,
} from "@/lib/format";
import type { VerificationRun, VerificationState } from "@/types/verification";

const STATE_ORDER: VerificationState[] = [
  "attention",
  "insufficient_evidence",
  "not_assessed",
  "consistent",
];

export function ReviewWorkspace({ opportunityId }: { opportunityId: string }) {
  const { getById, isLoading: opportunityLoading, warning: opportunityWarning } =
    useOpportunities();
  const {
    runs,
    latest,
    isLoading: runsLoading,
    warning: runsWarning,
    persistError,
    saveRun,
  } = useVerificationRuns(opportunityId);
  const opportunity = getById(opportunityId);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useScrollToHash(`${opportunity?.evidence.length ?? 0}:${runs.length}`);

  const selectedRun = useMemo(() => {
    if (selectedRunId) {
      return runs.find((run) => run.id === selectedRunId) ?? latest;
    }
    return latest;
  }, [latest, runs, selectedRunId]);

  const currentInput = useMemo(
    () => (opportunity ? toEngineInput(opportunity) : undefined),
    [opportunity],
  );
  const viewingHistorical = Boolean(
    selectedRun && latest && selectedRun.id !== latest.id,
  );
  const snapshotStale = Boolean(
    selectedRun?.inputSnapshot &&
      currentInput &&
      !engineInputsMatch(selectedRun.inputSnapshot, currentInput),
  );

  if (opportunityLoading || runsLoading) {
    return (
      <PageContainer>
        <LoadingState label="Loading review workspace…" />
      </PageContainer>
    );
  }

  if (!opportunity) {
    return (
      <PageContainer>
        <PageHeader
          title="Opportunity not found"
          description="This ID is not in the local workspace. It may have been cleared from this browser, or the address may be incomplete."
        />
        <EmptyState
          title="No matching record"
          description="Seeded demo opportunities and records created in this browser still appear in the opportunities list. Unreadable review storage does not change opportunity records."
          actions={
            <>
              <LinkButton href="/opportunities" variant="outline">
                Back to opportunities
              </LinkButton>
              <LinkButton href={`/opportunities/${DEMO_SCENARIO_ID}`}>
                Open Lumen Harbor Analytics
              </LinkButton>
            </>
          }
        />
      </PageContainer>
    );
  }

  function runChecks() {
    if (!opportunity) {
      return;
    }
    setIsRunning(true);
    setRunError(null);
    try {
      const input = toEngineInput(opportunity);
      const evaluation = evaluateOpportunity(input);
      const run: VerificationRun = {
        id: createId("run"),
        opportunityId: opportunity.id,
        timestamp: nowIso(),
        ...evaluation,
        inputSnapshot: input,
        evidenceCatalog: opportunity.evidence.map((item) => ({
          id: item.id,
          displayName: item.displayName,
        })),
      };
      const result = saveRun(run);
      setSelectedRunId(run.id);
      if (!result.saved) {
        setRunError(
          result.persistError ??
            "The review ran, but it could not be saved to browser storage.",
        );
      }
    } catch {
      setRunError("The review could not be completed. No saved run was recorded.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <PageContainer width="6xl" className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={`Review · ${opportunity.companyName}`}
        description="Verify this opportunity against entered evidence before sending money. Spot mismatches between seller promises and document terms."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={opportunity.status} />
            {opportunity.isDemo ? (
              <DemoBadge
                label={
                  isDemoScenario(opportunity.id)
                    ? "Synthetic demo scenario"
                    : "Demo"
                }
              />
            ) : null}
            <Button
              type="button"
              onClick={runChecks}
              disabled={isRunning}
              className="bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              {isRunning ? "Running…" : "Run checks"}
            </Button>
            <LinkButton href={`/opportunities/${opportunity.id}`} variant="outline">
              Opportunity detail
            </LinkButton>
            <LinkButton
              href={`/prestocks?opportunity=${opportunity.id}`}
              variant="outline"
            >
              PreStocks reference
            </LinkButton>
          </div>
        }
      />

      {/* Demo helper walkthrough */}
      {isDemoScenario(opportunity.id) ? (
        <div className="space-y-3">
          <DemoScenarioNotice compact />
          <DemoWalkthroughHint
            surface="review"
            opportunity={opportunity}
            latestRun={latest}
            selectedRun={selectedRun}
          />
        </div>
      ) : null}

      {/* Alerts & Historical Banners */}
      {opportunityWarning ? <Banner>{opportunityWarning}</Banner> : null}
      {runsWarning ? <Banner>{runsWarning}</Banner> : null}
      {runError ? <Banner tone="danger">{runError}</Banner> : null}
      {persistError && !runError ? <Banner tone="danger">{persistError}</Banner> : null}
      {viewingHistorical ? (
        <Banner>
          You are viewing a historical snapshot from{" "}
          {formatDateTime(selectedRun!.timestamp)}. Editing evidence or running
          checks again does not change this snapshot.
        </Banner>
      ) : null}
      {snapshotStale && !viewingHistorical ? (
        <Banner>
          Structured values have changed since this snapshot. Run checks again to
          review current values. This snapshot stays as it was.
        </Banner>
      ) : null}

      {/* Prominent Action Banner before first run */}
      {!selectedRun ? (
        <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card/70 to-card/50 p-6 sm:p-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Ready for Verification
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Run checks to evaluate this opportunity
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              VERIQ will compare the seller&apos;s claimed instrument, quantity, price, and payment terms against the entered structured evidence records.
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={runChecks}
            disabled={isRunning}
            className="h-11 px-6 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 shrink-0"
          >
            <Play className="size-4 fill-current mr-1.5" />
            {isRunning ? "Running checks…" : "Run checks now"}
          </Button>
        </div>
      ) : null}

      {/* 3 Primary Architectural Sections */}
      <div className="space-y-8">
        {/* SECTION 1: What the seller claims */}
        <section aria-labelledby="section-claims-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="section-claims-heading"
                className="text-xs font-semibold uppercase tracking-wider text-primary"
              >
                Section 1 · Baseline terms
              </h2>
              <p className="text-lg font-bold text-foreground">
                What the seller claims
              </p>
            </div>
            <LinkButton
              href={`/opportunities/${opportunity.id}`}
              variant="link"
              size="sm"
            >
              Edit claims on opportunity page →
            </LinkButton>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4 sm:p-5">
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryField label="Company" value={opportunity.companyName} />
              <SummaryField
                label="Claimed Security / Interest"
                value={instrumentLabels[opportunity.instrument]}
              />
              <SummaryField
                label="Offered Quantity"
                value={formatQuantity(opportunity)}
              />
              <SummaryField
                label="Quoted Price"
                value={formatClaimedPrice(opportunity)}
              />
            </dl>
            {opportunity.claimedSummary ? (
              <p className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Seller memo summary: </span>
                {opportunity.claimedSummary}
              </p>
            ) : null}
          </div>
        </section>

        {/* SECTION 2: What information or evidence was entered */}
        <section aria-labelledby="section-evidence-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="section-evidence-heading"
                className="text-xs font-semibold uppercase tracking-wider text-primary"
              >
                Section 2 · Supporting documentation
              </h2>
              <p className="text-lg font-bold text-foreground">
                What information or evidence was entered
              </p>
            </div>
            <LinkButton
              href={`/opportunities/${opportunity.id}#evidence`}
              variant="link"
              size="sm"
            >
              Add or edit evidence →
            </LinkButton>
          </div>

          {opportunity.evidence.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {opportunity.evidence.map((item) => (
                <div
                  key={item.id}
                  id={`evidence-${item.id}`}
                  className="rounded-xl border border-border bg-card/60 p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <FileCheck className="size-4 text-primary shrink-0" />
                      <span className="break-words">{item.displayName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description || "Evidence record on file."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {item.id}
                    </span>
                    <LinkButton
                      href={`/opportunities/${opportunity.id}#structured-${item.id}`}
                      variant="link"
                      size="xs"
                    >
                      View structured details
                    </LinkButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No evidence records entered"
              description="Checks run against claimed opportunity fields only. Missing structured values produce Insufficient evidence, not positive confirmation."
              actions={
                <LinkButton href={`/opportunities/${opportunity.id}#evidence`}>
                  Attach evidence record
                </LinkButton>
              }
            />
          )}

          {/* Progressive disclosure for readiness/completeness guide */}
          <details className="group rounded-xl border border-border bg-card/30 p-3.5 transition-colors hover:bg-card/50">
            <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                Input completeness guide (which structured values are filled)
              </span>
              <span className="text-primary text-[11px] group-open:hidden">
                Show guide →
              </span>
              <span className="text-muted-foreground text-[11px] hidden group-open:inline">
                Hide guide ↑
              </span>
            </summary>
            <div className="mt-3 pt-3 border-t border-border/50">
              <ReviewReadiness opportunity={opportunity} context="review" />
            </div>
          </details>
        </section>

        {/* SECTION 3: What VERIQ found */}
        <section aria-labelledby="section-findings-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2
                id="section-findings-heading"
                className="text-xs font-semibold uppercase tracking-wider text-primary"
              >
                Section 3 · Verification findings
              </h2>
              <p className="text-lg font-bold text-foreground">
                What VERIQ found
              </p>
            </div>
            {selectedRun ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={runChecks}
                disabled={isRunning}
              >
                {isRunning ? "Re-running…" : "Re-run checks"}
              </Button>
            ) : null}
          </div>

          {!selectedRun ? (
            <EmptyState
              title="No review findings yet"
              description="Click 'Run checks' above to evaluate what matches, what conflicts, and what information is still missing from the entered documents."
              actions={
                <Button type="button" onClick={runChecks} disabled={isRunning}>
                  {isRunning ? "Running…" : "Run checks"}
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              {/* Executive Plain English Summary */}
              <ReviewReport companyName={opportunity.companyName} run={selectedRun} />

              {/* Grouped Findings sorted by Attention -> Insufficient -> Not assessed -> Consistent */}
              <div className="space-y-6">
                {STATE_ORDER.map((state) => {
                  const findings = selectedRun.findings.filter(
                    (finding) => finding.state === state,
                  );
                  if (findings.length === 0) {
                    return null;
                  }
                  return (
                    <div key={state} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                          {verificationStateLabels[state]} ({findings.length})
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {state === "attention" && "— Items that conflict or need your immediate attention"}
                          {state === "insufficient_evidence" && "— Missing data needed to evaluate"}
                          {state === "not_assessed" && "— Stated conditions not independently confirmed"}
                          {state === "consistent" && "— Entered values align mathematically"}
                        </span>
                      </div>
                      <ul className="space-y-3">
                        {findings.map((finding) => (
                          <FindingCard
                            key={finding.id}
                            finding={finding}
                            opportunityId={opportunity.id}
                            evidence={opportunity.evidence}
                            inputSnapshot={selectedRun.inputSnapshot}
                            evidenceCatalog={selectedRun.evidenceCatalog}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Progressive disclosure for finding state legend */}
              <details className="group rounded-xl border border-border bg-card/30 p-3.5 transition-colors hover:bg-card/50">
                <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Info className="size-3.5 text-primary" />
                    Finding state definitions & legal boundaries
                  </span>
                  <span className="text-primary text-[11px] group-open:hidden">
                    Show definitions →
                  </span>
                  <span className="text-muted-foreground text-[11px] hidden group-open:inline">
                    Hide definitions ↑
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <FindingStateLegend />
                </div>
              </details>
            </div>
          )}
        </section>

        {/* SECTION 4: Run History */}
        <section aria-labelledby="section-history-heading" className="space-y-3 pt-4 border-t border-border/70">
          <div className="flex items-center gap-2">
            <History className="size-4 text-primary" />
            <SectionHeading
              id="section-history-heading"
              title="Review history"
              description="Each run is saved in your local browser history. Earlier snapshots stay exactly as they were."
            />
          </div>
          {runs.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No saved runs yet. Click &apos;Run checks&apos; to record your first snapshot.
            </p>
          ) : (
            <ul className="space-y-2">
              {runs.map((run, index) => (
                <li key={run.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedRunId(run.id)}
                    className={`w-full rounded-xl border p-3 text-left text-xs transition-colors hover:bg-muted/30 ${
                      selectedRun?.id === run.id
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-card/60"
                    }`}
                    aria-current={selectedRun?.id === run.id}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <span>{formatDateTime(run.timestamp)}</span>
                        {index === 0 ? " · Latest" : ""}
                        {selectedRun?.id === run.id ? " · Showing" : ""}
                      </span>
                      <span className="text-muted-foreground flex flex-wrap gap-2">
                        Ruleset {run.rulesetVersion} · Attention {run.summary.attention}{" "}
                        · Insufficient {run.summary.insufficient_evidence} · Not
                        assessed {run.summary.not_assessed} · Consistent{" "}
                        {run.summary.consistent}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* SECTION 5: PreStocks Reference Panel (Secondary market context) */}
        <div className="pt-4 border-t border-border/70">
          <PreStocksReferencePanel opportunity={opportunity} />
        </div>

        {/* Consolidated Disclaimers at the bottom */}
        <section className="pt-4 border-t border-border/80 space-y-3">
          <DemoReviewNotice />
          <PersistenceNotice />
        </section>
      </div>
    </PageContainer>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium break-words text-foreground">
        {value}
      </dd>
    </div>
  );
}
