import { assessReviewReadiness } from "@/lib/review-readiness";
import { LinkButton } from "@/components/link-button";
import type { Opportunity } from "@/types/opportunity";

export function ReviewReadiness({ opportunity }: { opportunity: Opportunity }) {
  const readiness = assessReviewReadiness(opportunity);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Review readiness
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Input-completeness guide only. It is not a risk score, verification
            verdict, or finding state. The engine still produces the review
            results.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {readiness.readyCount} ready · {readiness.needsInputCount} need structured values
        </p>
      </div>
      <ul className="mt-3 space-y-2">
        {readiness.checks.map((check) => (
          <li
            key={check.ruleId}
            className="rounded-md border border-border px-3 py-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-foreground">
                {check.ruleId} · {check.title}
              </p>
              <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                {check.status === "ready"
                  ? "Enough input to run"
                  : "Needs structured values"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{check.summary}</p>
            {check.missing.length > 0 ? (
              <ul className="mt-1 list-disc pl-4 text-xs text-foreground">
                {check.missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {check.evidenceIds.length > 0 ? (
              <p className="mt-1 flex flex-wrap gap-2 text-xs">
                {check.evidenceIds.map((evidenceId) => {
                  const record = opportunity.evidence.find(
                    (item) => item.id === evidenceId,
                  );
                  return (
                    <LinkButton
                      key={evidenceId}
                      href={`/opportunities/${opportunity.id}#evidence-${evidenceId}`}
                      variant="link"
                      size="sm"
                    >
                      {record?.displayName ?? evidenceId}
                    </LinkButton>
                  );
                })}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
