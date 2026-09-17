import { FindingStateBadge } from "@/components/review/finding-state-badge";
import { formatDateTime, verificationStateLabels } from "@/lib/format";
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
  const mainFindings = notableFindings(run.findings);

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">Review summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {companyName} · {formatDateTime(run.timestamp)} · Ruleset{" "}
            {run.rulesetVersion}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATE_ORDER.map((state) => (
            <span
              key={state}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <FindingStateBadge state={state} />
              {run.summary[state]}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Consistent findings mean entered values matched for that check. They do
        not establish legitimacy, safety, ownership, or legal transferability.
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div>
          <h3 className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Main findings
          </h3>
          <ul className="mt-1 space-y-1 text-sm text-foreground">
            {mainFindings.map((finding) => (
              <li key={finding.id}>
                <span className="text-muted-foreground">
                  {finding.ruleId} · {verificationStateLabels[finding.state]}:
                </span>{" "}
                {finding.title}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Missing information
          </h3>
          {missing.length > 0 ? (
            <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-foreground">
              {missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              This run did not record missing structured fields. That is not a
              complete diligence packet and not independent confirmation.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function notableFindings(findings: Finding[]): Finding[] {
  const ranked = [...findings].sort(
    (left, right) =>
      STATE_ORDER.indexOf(left.state) - STATE_ORDER.indexOf(right.state),
  );
  return ranked;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
