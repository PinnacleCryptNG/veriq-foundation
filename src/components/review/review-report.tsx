import { FindingStateBadge } from "@/components/review/finding-state-badge";
import { SectionHeading } from "@/components/section-heading";
import { formatDateTime, verificationStateLabels } from "@/lib/format";
import type {
  VerificationRun,
  VerificationState,
} from "@/types/verification";

const STATE_ORDER: VerificationState[] = [
  "attention",
  "insufficient_evidence",
  "not_assessed",
  "consistent",
];

export function ReviewReport({
  companyName,
  run,
}: {
  companyName: string;
  run: VerificationRun;
}) {
  const missing = unique(
    run.findings.flatMap((finding) => finding.missingInformation),
  );

  return (
    <section className="rounded-xl border border-border bg-card/60 p-4 sm:p-5 space-y-4">
      <SectionHeading
        title="Verification summary"
        description={`${companyName} · Verified at ${formatDateTime(run.timestamp)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {STATE_ORDER.map((state) => (
              <span
                key={state}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <FindingStateBadge state={state} />
                <span className="font-semibold text-foreground">{run.summary[state]}</span>
              </span>
            ))}
          </div>
        }
      />

      <p className="text-xs leading-5 text-muted-foreground">
        Checks evaluate whether entered terms match submitted documents. A &apos;Consistent&apos; result means numbers align, not that an investment is safe or title is certified.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/60">
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Key findings overview
          </h3>
          <ul className="space-y-1.5 text-xs text-foreground">
            {run.findings.map((finding) => (
              <li key={finding.id} className="flex items-start gap-1.5">
                <span className="font-semibold shrink-0">
                  {finding.ruleId} · {verificationStateLabels[finding.state]}:
                </span>
                <span className="text-muted-foreground">{finding.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Missing information
          </h3>
          {missing.length > 0 ? (
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              {missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">
              All structured fields required by the five evaluation checks were provided.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
