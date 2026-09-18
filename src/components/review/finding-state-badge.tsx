import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { verificationStateLabels } from "@/lib/format";
import type { VerificationState } from "@/types/verification";

const stateClassName: Record<VerificationState, string> = {
  consistent: "border-[#25D0A5]/40 bg-[#25D0A5]/10 text-[#25D0A5]",
  attention: "border-[#F5B84B]/40 bg-[#F5B84B]/10 text-[#F5B84B]",
  insufficient_evidence: "border-border bg-muted/40 text-muted-foreground",
  not_assessed: "border-border bg-transparent text-foreground",
};

export function FindingStateBadge({ state }: { state: VerificationState }) {
  return (
    <Badge variant="outline" className={cn(stateClassName[state])}>
      {verificationStateLabels[state]}
    </Badge>
  );
}
