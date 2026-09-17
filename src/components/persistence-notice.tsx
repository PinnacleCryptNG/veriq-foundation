import { cn } from "@/lib/utils";

export function PersistenceNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <p>
        <span className="font-medium text-foreground">Local demo storage. </span>
        Opportunities and evidence metadata are saved in this browser’s
        localStorage. That is not secure production storage, is limited to this
        device, and can be cleared by the browser.
      </p>
    </div>
  );
}
