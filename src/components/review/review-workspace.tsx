"use client";

import { useMemo, useState } from "react";
import { Banner, EmptyState, LoadingState } from "@/components/feedback";
import { DemoBadge } from "@/components/opportunities/demo-badge";
import { StatusBadge } from "@/components/opportunities/status-badge";
import { LimitationNotice } from "@/components/limitation-notice";
import { LinkButton } from "@/components/link-button";
import { PageHeader } from "@/components/page-header";
import { PersistenceNotice } from "@/components/persistence-notice";
import { DemoReviewNotice } from "@/components/review/demo-review-notice";
import { DemoScenarioNotice } from "@/components/review/demo-scenario-notice";
import { FindingCard } from "@/components/review/finding-card";
import { ReviewReadiness } from "@/components/review/review-readiness";
import { ReviewReport } from "@/components/review/review-report";
import { Button } from "@/components/ui/button";
import { isDemoScenario } from "@/data/demo-opportunities";
import { useOpportunities } from "@/hooks/use-opportunities";
import { useVerificationRuns } from "@/hooks/use-verification-runs";
import { evaluateOpportunity } from "@/engine/run";
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

  const selectedRun = useMemo(() => {
    if (selectedRunId) {
      return runs.find((run) => run.id === selectedRunId) ?? latest;
    }
    return latest;
  }, [latest, runs, selectedRunId]);

  if (opportunityLoading || runsLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <LoadingState label="Loading review workspace…" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Opportunity not found"
          actions={
            <LinkButton href="/opportunities" variant="outline">
              Back to opportunities
            </LinkButton>
          }
        />
      </div>
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
        inputSnapshot: input,
        evidenceCatalog: opportunity.evidence.map((item) => ({
          id: item.id,
          displayName: item.displayName,
        })),
        ...evaluation,
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={`Review · ${opportunity.companyName}`}
        description="Deterministic checks on entered claims and structured evidence values. Intake status is separate from review findings."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={opportunity.status} />
            {opportunity.isDemo ? <DemoBadge /> : null}
            <Button type="button" onClick={runChecks} disabled={isRunning}>
              {isRunning ? "Running…" : "Run checks"}
            </Button>
            <LinkButton href={`/opportunities/${opportunity.id}`} variant="outline">
              Opportunity detail
            </LinkButton>
          </div>
        }
      />

      <DemoReviewNotice />
      {isDemoScenario(opportunity.id) ? (
        <DemoScenarioNotice compact />
      ) : null}
      <LimitationNotice />
      <PersistenceNotice />
      {opportunityWarning ? <Banner>{opportunityWarning}</Banner> : null}
      {runsWarning ? <Banner>{runsWarning}</Banner> : null}
      {runError ? <Banner tone="danger">{runError}</Banner> : null}
      {persistError && !runError ? <Banner tone="danger">{persistError}</Banner> : null}

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground">Opportunity summary</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryField label="Opportunity" value={opportunity.companyName} />
          <SummaryField label="Security / interest" value={instrumentLabels[opportunity.instrument]} />
          <SummaryField label="Quantity offered" value={formatQuantity(opportunity)} />
          <SummaryField label="Quoted price" value={formatClaimedPrice(opportunity)} />
        </dl>
      </section>

      <ReviewReadiness opportunity={opportunity} />

      {!selectedRun ? (
        <EmptyState
          title="No review run yet"
          description="Run checks to compare opportunity claims with structured evidence values. Uploaded files are not read. Results will not say the opportunity is verified or safe."
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
                <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
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
          <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
            Evidence records in this review
          </h2>
          <ul className="space-y-2">
            {opportunity.evidence.map((item) => (
              <li
                key={item.id}
                id={`evidence-${item.id}`}
                className="scroll-mt-20 rounded-lg border border-border bg-card px-3 py-2 text-sm"
              >
                <p className="font-medium text-foreground">{item.displayName}</p>
                <p className="text-xs text-muted-foreground">
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
      ) : null}

      {runs.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
            Review history
          </h2>
          <p className="text-xs text-muted-foreground">
            Each run is stored separately. Editing structured evidence does not
            change previous findings.
          </p>
          <ul className="space-y-2">
            {runs.map((run) => (
              <li key={run.id}>
                <button
                  type="button"
                  onClick={() => setSelectedRunId(run.id)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-sm hover:bg-muted/30"
                  aria-current={selectedRun?.id === run.id}
                >
                  <span className="text-foreground">
                    {formatDateTime(run.timestamp)}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    Ruleset {run.rulesetVersion} · Attention {run.summary.attention} ·
                    Insufficient {run.summary.insufficient_evidence} · Not assessed{" "}
                    {run.summary.not_assessed} · Consistent {run.summary.consistent}
                    {selectedRun?.id === run.id ? " · Showing" : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
