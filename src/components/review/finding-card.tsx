"use client";

import { FindingStateBadge } from "@/components/review/finding-state-badge";
import { LinkButton } from "@/components/link-button";
import { resolveComparedValues } from "@/lib/compared-values";
import { findingCategoryLabels, verificationStateLabels } from "@/lib/format";
import { getFindingBuyerGuidance } from "@/lib/finding-buyer-guidance";
import { HelpCircle, AlertCircle, ArrowRight, Code } from "lucide-react";
import type { Evidence } from "@/types/opportunity";
import type {
  EvidenceCatalogEntry,
  EngineInput,
  Finding,
} from "@/types/verification";

export function FindingCard({
  finding,
  opportunityId,
  evidence,
  inputSnapshot,
  evidenceCatalog,
}: {
  finding: Finding;
  opportunityId: string;
  evidence: Evidence[];
  inputSnapshot?: EngineInput;
  evidenceCatalog?: EvidenceCatalogEntry[];
}) {
  const guidance = getFindingBuyerGuidance(finding);
  const comparedValues = resolveComparedValues(
    finding.comparedFields,
    inputSnapshot,
  );
  const usedEvidence = resolveUsedEvidence(
    finding.evidenceIds,
    evidence,
    evidenceCatalog,
  );
  const opportunityOnly =
    finding.evidenceIds.length === 0 &&
    finding.comparedFields.some((field) => field.startsWith("opportunity."));

  return (
    <li className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4 transition-colors hover:border-border/90">
      {/* Header: Title and Finding badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-primary">
              {finding.ruleId} · {verificationStateLabels[finding.state]}:
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {finding.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {finding.explanation}
          </p>
        </div>
        <div className="shrink-0">
          <FindingStateBadge state={finding.state} />
        </div>
      </div>

      {/* 3 Plain English Buyer Questions */}
      <div className="grid gap-3 sm:grid-cols-3 rounded-lg border border-border/80 bg-background/50 p-3.5 text-xs">
        <div className="space-y-1">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <AlertCircle className="size-3.5 text-primary" />
            What was found
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {guidance.differsOrMissing}
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5 text-[#F5B84B]" />
            Why it matters
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {guidance.whyItMatters}
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <ArrowRight className="size-3.5 text-[#25D0A5]" />
            What you can do
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {guidance.nextAction}
          </p>
        </div>
      </div>

      {/* Expandable Technical Details */}
      <details className="group text-xs text-muted-foreground">
        <summary className="flex cursor-pointer items-center justify-between font-medium text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-1.5">
            <Code className="size-3.5 text-primary/70" />
            Technical audit details ({finding.ruleId} · {findingCategoryLabels[finding.category]})
          </span>
          <span className="text-[11px] text-primary group-open:hidden">
            Show values & rule info →
          </span>
          <span className="text-[11px] text-muted-foreground hidden group-open:inline">
            Hide technical details ↑
          </span>
        </summary>

        <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
          {/* Compared values */}
          <div>
            <p className="font-semibold uppercase tracking-wider text-[11px] text-muted-foreground">
              Compared values
            </p>
            <ul className="mt-1 space-y-1">
              {comparedValues.map((row) => (
                <li key={row.path} className="flex gap-1.5">
                  <span className="font-medium text-foreground">{row.label}:</span>
                  <span className="font-mono text-muted-foreground">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evidence used */}
          <div>
            <p className="font-semibold uppercase tracking-wider text-[11px] text-muted-foreground">
              Evidence records cited
            </p>
            <div className="mt-1">
              {usedEvidence.length === 0 ? (
                <span>
                  {opportunityOnly
                    ? "This finding evaluates claimed opportunity fields only. No evidence record attached."
                    : "No evidence record cited. Required structured fields are missing."}
                </span>
              ) : (
                <ul className="space-y-1.5">
                  {usedEvidence.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{item.displayName}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">({item.id})</span>
                      {item.present ? (
                        <div className="flex gap-2">
                          <LinkButton
                            href={`/opportunities/${opportunityId}#evidence-${item.id}`}
                            variant="link"
                            size="xs"
                          >
                            Open record
                          </LinkButton>
                          <LinkButton
                            href={`/opportunities/${opportunityId}#structured-${item.id}`}
                            variant="link"
                            size="xs"
                          >
                            Edit structured details
                          </LinkButton>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          (Used at run time; record updated since run)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Missing fields */}
          {finding.missingInformation.length > 0 ? (
            <div>
              <p className="font-semibold uppercase tracking-wider text-[11px] text-muted-foreground">
                Missing inputs for this check
              </p>
              <ul className="mt-1 list-disc pl-4 space-y-0.5 text-foreground">
                {finding.missingInformation.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Rule limitation */}
          <div>
            <p className="font-semibold uppercase tracking-wider text-[11px] text-muted-foreground">
              Rule limitation
            </p>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">
              {finding.limitation}
            </p>
          </div>
        </div>
      </details>
    </li>
  );
}

function resolveUsedEvidence(
  evidenceIds: string[],
  evidence: Evidence[],
  catalog?: EvidenceCatalogEntry[],
) {
  return evidenceIds.flatMap((id) => {
    const current = evidence.find((item) => item.id === id);
    if (current) {
      return [
        {
          id,
          displayName: current.displayName,
          present: true,
        },
      ];
    }
    const historical = catalog?.find((item) => item.id === id);
    if (historical) {
      return [
        {
          id,
          displayName: historical.displayName,
          present: false,
        },
      ];
    }
    return [];
  });
}
