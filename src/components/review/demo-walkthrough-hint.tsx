import { LinkButton } from "@/components/link-button";
import { lumenWalkthroughCopy, type WalkthroughSurface } from "@/lib/lumen-walkthrough";
import type { Opportunity } from "@/types/opportunity";
import type { VerificationRun } from "@/types/verification";
import { CheckCircle2, Circle } from "lucide-react";

export function DemoWalkthroughHint({
  surface,
  opportunity,
  latestRun,
  selectedRun,
}: {
  surface: WalkthroughSurface;
  opportunity?: Opportunity;
  latestRun?: VerificationRun | null;
  selectedRun?: VerificationRun | null;
}) {
  const copy = lumenWalkthroughCopy({
    surface,
    opportunity,
    latestRun,
    selectedRun,
  });

  // 22. Guided demo step progress indicator
  // Steps: 1. Inspect claims -> 2. Run verification checks -> 3. Inspect findings & gaps -> 4. Fix wire arithmetic
  const hasRun = Boolean(latestRun);
  const viewingHistory = Boolean(selectedRun && latestRun && selectedRun.id !== latestRun.id);
  const isComplete = hasRun && !viewingHistory && latestRun?.findings.some((f) => f.ruleId === "R04" && f.state === "consistent");

  let currentStep = 1;
  if (!hasRun) {
    currentStep = surface === "review" ? 2 : 1;
  } else if (hasRun && !isComplete) {
    currentStep = 3;
  } else if (isComplete) {
    currentStep = 4;
  }

  return (
    <section className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
      {/* Visual step indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Guided Demo Walkthrough
          </span>
          <span className="text-xs text-muted-foreground">
            · Step {currentStep} of 4
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className={`inline-flex items-center gap-1 ${currentStep >= 1 ? "text-primary font-semibold" : ""}`}>
            {currentStep > 1 ? <CheckCircle2 className="size-3 text-[#25D0A5]" /> : <Circle className="size-3 fill-primary/30" />}
            1. Terms
          </span>
          <span>→</span>
          <span className={`inline-flex items-center gap-1 ${currentStep >= 2 ? "text-primary font-semibold" : ""}`}>
            {currentStep > 2 ? <CheckCircle2 className="size-3 text-[#25D0A5]" /> : <Circle className="size-3" />}
            2. Run checks
          </span>
          <span>→</span>
          <span className={`inline-flex items-center gap-1 ${currentStep >= 3 ? "text-primary font-semibold" : ""}`}>
            {currentStep > 3 ? <CheckCircle2 className="size-3 text-[#25D0A5]" /> : <Circle className="size-3" />}
            3. Spot gaps
          </span>
          <span>→</span>
          <span className={`inline-flex items-center gap-1 ${currentStep >= 4 ? "text-primary font-semibold" : ""}`}>
            <Circle className="size-3" />
            4. Resolve math
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">{copy.title}</h2>
        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{copy.body}</p>
      </div>

      {copy.href && copy.action ? (
        <div className="pt-1">
          <LinkButton href={copy.href} size="sm">
            {copy.action}
          </LinkButton>
        </div>
      ) : null}
    </section>
  );
}
