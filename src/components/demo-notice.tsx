import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function DemoNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <p>
        <span className="font-medium text-foreground">Demo data.</span> Seeded
        records are labeled Demo. They are not live opportunities, and{" "}
        {siteConfig.name} has not reviewed or verified them.
      </p>
    </div>
  );
}
