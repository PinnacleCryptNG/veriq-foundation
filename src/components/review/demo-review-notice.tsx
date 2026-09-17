import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoReviewNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
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
          Demo review — not independent verification.{" "}
        </span>
        Checks compare user-entered claims with explicitly entered structured
        evidence values. They do not read documents, confirm authenticity,
        determine ownership, or assess investment safety. Consistent findings
        do not mean an opportunity is legitimate or safe.
      </p>
    </div>
  );
}
