import { FindingStateBadge } from "@/components/review/finding-state-badge";
import { verificationStateHelp, verificationStateLabels } from "@/lib/format";
import type { VerificationState } from "@/types/verification";

const STATE_ORDER: VerificationState[] = [
  "attention",
  "insufficient_evidence",
  "not_assessed",
  "consistent",
];

export function FindingStateLegend() {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-medium text-foreground">What finding states mean</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {STATE_ORDER.map((state) => (
          <li key={state} className="space-y-1">
            <FindingStateBadge state={state} />
            <p className="text-xs leading-5 text-muted-foreground">
              <span className="font-medium text-foreground">
                {verificationStateLabels[state]}.{" "}
              </span>
              {verificationStateHelp[state]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
