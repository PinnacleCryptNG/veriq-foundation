import { assessReviewReadiness } from "@/lib/review-readiness";
import { LinkButton } from "@/components/link-button";
import { SectionHeading } from "@/components/section-heading";
import type { Opportunity } from "@/types/opportunity";

export function ReviewReadiness({
  opportunity,
  context = "detail",
}: {
  opportunity: Opportunity;
  context?: "detail" | "review";
}) {
  const readiness = assessReviewReadiness(opportunity);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <SectionHeading
        title={
          context === "review"
            ? "Current structured inputs"
            : "Review readiness"
        }
        description={
          context === "review"
            ? "This is input completeness for the opportunity as it stands now. It is not this snapshot’s finding states, a risk score, or a verification verdict."
            : "Input-completeness guide only. It is not a risk score, verification verdict, or finding state. The engine still produces the review results."
        }
        actions={
          <p className="text-xs text-muted-foreground">
            {readiness.readyCount} with required fields · {readiness.needsInputCount} missing values
          </p>
        }
      />
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
                  ? "Structured fields present"
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
