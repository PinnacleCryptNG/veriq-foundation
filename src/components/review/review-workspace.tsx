"use client";

import { useMemo, useState } from "react";
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
    <PageContainer>
      <PageHeader
        title={`Review · ${opportunity.companyName}`}
        description="Deterministic checks on entered claims and structured evidence values. Intake status is separate from review findings."
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
            <Button type="button" onClick={runChecks} disabled={isRunning}>
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

      <DemoReviewNotice />
      {isDemoScenario(opportunity.id) ? (
        <>
          <DemoScenarioNotice compact />
          <DemoWalkthroughHint
            surface="review"
            opportunity={opportunity}
            latestRun={latest}
            selectedRun={selectedRun}
          />
        </>
      ) : null}
      <PersistenceNotice />
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

      <section className="rounded-lg border border-border bg-card p-4">
        <SectionHeading title="Opportunity summary" />
        <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryField label="Opportunity" value={opportunity.companyName} />
          <SummaryField
            label="Security / interest"
            value={instrumentLabels[opportunity.instrument]}
          />
          <SummaryField label="Quantity offered" value={formatQuantity(opportunity)} />
          <SummaryField label="Quoted price" value={formatClaimedPrice(opportunity)} />
        </dl>
      </section>

      <ReviewReadiness opportunity={opportunity} context="review" />
      <FindingStateLegend />

      {!selectedRun ? (
        <EmptyState
          title="No review run yet"
          description="Run checks to compare opportunity claims with structured evidence values. Uploaded files are not read. Results will not say the opportunity is verified or safe."
          actions={
            <Button type="button" onClick={runChecks} disabled={isRunning}>
              {isRunning ? "Running…" : "Run checks"}
            </Button>
          }
        />
      ) : (
        <>
          <ReviewReport companyName={opportunity.companyName} run={selectedRun} />

          {STATE_ORDER.map((state) => {
            const findings = selectedRun.findings.filter(
              (finding) => finding.state === state,
            );
            if (findings.length === 0) {
              return null;
            }
            return (
              <section key={state} className="space-y-3">
                <h2 className="text-sm font-medium text-foreground">
                  {verificationStateLabels[state]}
                </h2>
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
              </section>
            );
          })}
        </>
      )}

      {opportunity.evidence.length > 0 ? (
        <section className="space-y-2">
          <SectionHeading
            title="Evidence records in this review"
            description="Links open the current opportunity record. Historical findings still use the snapshotted catalog for that run."
          />
          <ul className="space-y-2">
            {opportunity.evidence.map((item) => (
              <li
                key={item.id}
                id={`evidence-${item.id}`}
                className="scroll-mt-20 rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <p className="font-medium break-words text-foreground">
                  {item.displayName}
                </p>
                <p className="text-xs break-all text-muted-foreground">
                  {item.id} · Structured values only. File contents are not used.
                </p>
                <LinkButton
                  href={`/opportunities/${opportunity.id}#evidence-${item.id}`}
                  variant="link"
                  size="sm"
                >
                  Open on opportunity page
                </LinkButton>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState
          title="No evidence records on this opportunity"
          description="Checks can still run against claimed opportunity fields. Missing structured values produce Insufficient evidence, not a positive confirmation."
        />
      )}

      <section className="space-y-2">
        <SectionHeading
          title="Review history"
          description="Each run is stored separately from opportunity records. Editing structured evidence does not change previous findings."
        />
        {runs.length === 0 ? (
          <EmptyState
            title="No saved runs"
            description="After you run checks, snapshots appear here so you can compare later edits without losing earlier results."
          />
        ) : (
          <ul className="space-y-2">
            {runs.map((run, index) => (
              <li key={run.id}>
                <button
                  type="button"
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted/30 ${
                    selectedRun?.id === run.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                  aria-current={selectedRun?.id === run.id}
                >
                  <span className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline">
                    <span className="text-foreground">
                      {formatDateTime(run.timestamp)}
                      {index === 0 ? " · Latest" : ""}
                      {selectedRun?.id === run.id ? " · Showing" : ""}
                    </span>
                    <span className="text-muted-foreground">
                      Ruleset {run.rulesetVersion} · Attention {run.summary.attention}{" "}
                      · Insufficient {run.summary.insufficient_evidence} · Not
                      assessed {run.summary.not_assessed} · Consistent{" "}
                      {run.summary.consistent}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <PreStocksReferencePanel opportunity={opportunity} />
    </PageContainer>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm break-words text-foreground">{value}</dd>
    </div>
  );
}
