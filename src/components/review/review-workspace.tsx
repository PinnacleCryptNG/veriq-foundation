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
import { FindingStateBadge } from "@/components/review/finding-state-badge";
import { Button } from "@/components/ui/button";
import { useOpportunities } from "@/hooks/use-opportunities";
import { useVerificationRuns } from "@/hooks/use-verification-runs";
import { evaluateOpportunity } from "@/engine/run";
import { createId, nowIso } from "@/lib/ids";
import { toEngineInput } from "@/lib/to-engine-input";
import {
  findingCategoryLabels,
  formatClaimedPrice,
  formatDateTime,
  formatQuantity,
  instrumentLabels,
  verificationStateLabels,
} from "@/lib/format";
import type {
  Finding,
  VerificationRun,
  VerificationState,
} from "@/types/verification";

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
      const evaluation = evaluateOpportunity(toEngineInput(opportunity));
      const run: VerificationRun = {
        id: createId("run"),
        opportunityId: opportunity.id,
        timestamp: nowIso(),
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
      <LimitationNotice />
      <PersistenceNotice />
      {opportunityWarning ? <Banner>{opportunityWarning}</Banner> : null}
      {runsWarning ? <Banner>{runsWarning}</Banner> : null}
      {runError ? <Banner tone="danger">{runError}</Banner> : null}
      {persistError && !runError ? <Banner tone="danger">{persistError}</Banner> : null}

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground">Opportunity summary</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryField label="Security / interest" value={instrumentLabels[opportunity.instrument]} />
          <SummaryField label="Quantity offered" value={formatQuantity(opportunity)} />
          <SummaryField label="Quoted price" value={formatClaimedPrice(opportunity)} />
          <SummaryField
            label="Intake status"
            value="Not a review finding"
          />
        </dl>
      </section>

      {!selectedRun ? (
        <EmptyState
          title="No review run yet"
          description="Run checks to compare opportunity claims with structured evidence values. Uploaded files are not read. Results will not say the opportunity is verified or safe."
        />
      ) : (
        <>
          <section className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-sm font-medium text-foreground">Latest selected run</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateTime(selectedRun.timestamp)} · Ruleset{" "}
                  {selectedRun.rulesetVersion}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATE_ORDER.map((state) => (
                  <span
                    key={state}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <FindingStateBadge state={state} />
                    {selectedRun.summary[state]}
                  </span>
                ))}
              </div>
            </div>
          </section>

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
                  Structured values only. File contents are not used.
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

      {runs.length > 1 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-medium tracking-wide text-foreground uppercase">
            Previous runs
          </h2>
          <ul className="space-y-2">
            {runs.map((run) => (
              <li key={run.id}>
                <button
                  type="button"
                  onClick={() => setSelectedRunId(run.id)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-sm hover:bg-muted/30"
                >
                  <span className="text-foreground">
                    {formatDateTime(run.timestamp)}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    Ruleset {run.rulesetVersion} · Attention {run.summary.attention} ·
                    Insufficient {run.summary.insufficient_evidence} · Not assessed{" "}
                    {run.summary.not_assessed} · Consistent {run.summary.consistent}
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

function FindingCard({
  finding,
  opportunityId,
}: {
  finding: Finding;
  opportunityId: string;
}) {
  return (
    <li className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {finding.ruleId} · {findingCategoryLabels[finding.category]}
          </p>
          <h3 className="mt-1 text-sm font-medium text-foreground">
            {finding.title}
          </h3>
        </div>
        <FindingStateBadge state={finding.state} />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {finding.explanation}
      </p>
      <dl className="mt-3 space-y-2 text-xs">
        <div>
          <dt className="tracking-wide text-muted-foreground uppercase">
            Compared fields
          </dt>
          <dd className="mt-0.5 text-foreground">
            {finding.comparedFields.length > 0
              ? finding.comparedFields.join(", ")
              : "None"}
          </dd>
        </div>
        <div>
          <dt className="tracking-wide text-muted-foreground uppercase">
            Evidence used
          </dt>
          <dd className="mt-0.5">
            {finding.evidenceIds.length === 0 ? (
              <span className="text-foreground">
                No evidence record was used. This finding is based on missing
                structured values or opportunity claims only.
              </span>
            ) : (
              <span className="flex flex-wrap gap-2">
                {finding.evidenceIds.map((evidenceId) => (
                  <a
                    key={evidenceId}
                    href={`#evidence-${evidenceId}`}
                    className="text-primary hover:underline"
                  >
                    {evidenceId}
                  </a>
                ))}
                <LinkButton
                  href={`/opportunities/${opportunityId}#evidence-${finding.evidenceIds[0]}`}
                  variant="link"
                  size="sm"
                >
                  View on opportunity
                </LinkButton>
              </span>
            )}
          </dd>
        </div>
        {finding.missingInformation.length > 0 ? (
          <div>
            <dt className="tracking-wide text-muted-foreground uppercase">
              Missing information
            </dt>
            <dd className="mt-0.5 text-foreground">
              <ul className="list-disc pl-4">
                {finding.missingInformation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="tracking-wide text-muted-foreground uppercase">
            Limitation
          </dt>
          <dd className="mt-0.5 text-muted-foreground">{finding.limitation}</dd>
        </div>
      </dl>
    </li>
  );
}
