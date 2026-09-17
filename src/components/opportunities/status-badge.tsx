import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { statusDescriptions, statusLabels } from "@/lib/format";
import type { OpportunityStatus } from "@/types/opportunity";

const statusClassName: Record<OpportunityStatus, string> = {
  intake_incomplete:
    "border-border bg-secondary text-secondary-foreground",
  evidence_pending:
    "border-primary/25 bg-primary/10 text-primary",
  queued_for_review:
    "border-border bg-transparent text-foreground",
};

type StatusBadgeProps = {
  status: OpportunityStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      title={statusDescriptions[status]}
      className={cn(statusClassName[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}
