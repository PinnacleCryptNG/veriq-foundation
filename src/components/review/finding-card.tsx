"use client";

import { FindingStateBadge } from "@/components/review/finding-state-badge";
import { LinkButton } from "@/components/link-button";
import { resolveComparedValues } from "@/lib/compared-values";
import { findingCategoryLabels } from "@/lib/format";
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
            Compared values
          </dt>
          <dd className="mt-0.5 text-foreground">
            <ul className="space-y-1">
              {comparedValues.map((row) => (
                <li key={row.path}>
                  <span className="text-muted-foreground">{row.label}: </span>
                  {row.value}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="tracking-wide text-muted-foreground uppercase">
            Evidence used
          </dt>
          <dd className="mt-0.5">
            {usedEvidence.length === 0 ? (
              <span className="text-foreground">
                {opportunityOnly
                  ? "This finding uses opportunity claims only. No evidence record was attached."
                  : "No evidence record was used. Structured values required for this check are missing."}
              </span>
            ) : (
              <ul className="space-y-1">
                {usedEvidence.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground">{item.displayName}</span>
                    <span className="text-muted-foreground">{item.id}</span>
                    {item.present ? (
                      <>
                        <LinkButton
                          href={`/opportunities/${opportunityId}#evidence-${item.id}`}
                          variant="link"
                          size="sm"
                        >
                          Open evidence record
                        </LinkButton>
                        <LinkButton
                          href={`/opportunities/${opportunityId}#structured-${item.id}`}
                          variant="link"
                          size="sm"
                        >
                          Structured details
                        </LinkButton>
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        Used at run time; not on the current opportunity.
                      </span>
                    )}
                  </li>
                ))}
              </ul>
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
            Rule limitation
          </dt>
          <dd className="mt-0.5 text-muted-foreground">{finding.limitation}</dd>
        </div>
      </dl>
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
