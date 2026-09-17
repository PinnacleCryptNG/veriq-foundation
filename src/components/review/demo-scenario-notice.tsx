import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import { LinkButton } from "@/components/link-button";
import { cn } from "@/lib/utils";

export function DemoScenarioNotice({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm text-muted-foreground",
        className,
      )}
    >
      <p>
        <span className="font-medium text-foreground">
          Synthetic demo scenario.{" "}
        </span>
        Lumen Harbor Analytics is fictional. Every evidence record and structured
        value is labeled synthetic demo data. It is not a real company, issuer
        packet, or independently confirmed transaction.
      </p>
      {compact ? null : (
        <div className="mt-2 flex flex-wrap gap-2">
          <LinkButton href={`/opportunities/${DEMO_SCENARIO_ID}`} size="sm">
            Open Lumen Harbor Analytics
          </LinkButton>
          <LinkButton
            href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
            variant="outline"
            size="sm"
          >
            Open review workspace
          </LinkButton>
        </div>
      )}
    </div>
  );
}
