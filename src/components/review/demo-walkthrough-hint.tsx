import { LinkButton } from "@/components/link-button";
import { lumenWalkthroughCopy, type WalkthroughSurface } from "@/lib/lumen-walkthrough";
import type { Opportunity } from "@/types/opportunity";
import type { VerificationRun } from "@/types/verification";

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

  return (
    <section className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
      <h2 className="text-sm font-medium text-foreground">{copy.title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.body}</p>
      {copy.href && copy.action ? (
        <div className="mt-2">
          <LinkButton href={copy.href} size="sm">
            {copy.action}
          </LinkButton>
        </div>
      ) : null}
    </section>
  );
}
