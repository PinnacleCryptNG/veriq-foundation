import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { verificationStateLabels } from "@/lib/format";
import type { VerificationState } from "@/types/verification";

const stateClassName: Record<VerificationState, string> = {
  consistent: "border-primary/25 bg-primary/10 text-primary",
  attention: "border-border bg-secondary text-secondary-foreground",
  insufficient_evidence: "border-border bg-transparent text-muted-foreground",
  not_assessed: "border-border bg-transparent text-foreground",
};

export function FindingStateBadge({ state }: { state: VerificationState }) {
  return (
    <Badge variant="outline" className={cn(stateClassName[state])}>
      {verificationStateLabels[state]}
    </Badge>
  );
}
