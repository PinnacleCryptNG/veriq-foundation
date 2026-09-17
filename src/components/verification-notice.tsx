import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerificationNotice({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p>
        <span className="font-medium text-foreground">
          Intake status is not a review finding.{" "}
        </span>
        It only describes whether claimed materials have been collected. It is
        not approval, authenticity, ownership, or an assessment of investment
        safety.
      </p>
    </div>
  );
}
