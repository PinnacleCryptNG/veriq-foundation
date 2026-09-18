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
        VERIQ surfaces mismatches in the information you provide. It doesn’t invent facts, authenticate documents, confirm legal ownership, or replace a lawyer. Checks compare user-entered claims with explicitly entered structured values.
      </p>
    </div>
  );
}
