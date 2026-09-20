import { Clock3, PlayCircle } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";

/**
 * Keep this section deliberately honest until an approved recording is added
 * to the repository or supplied as an approved URL. A decorative preview or a
 * disabled video control could otherwise suggest that a recording is playable.
 */
export function VideoDemoSection() {
  return (
    <section
      aria-labelledby="video-demo-heading"
      className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm sm:p-6"
    >
      <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <PlayCircle className="size-3.5" aria-hidden="true" />
            Product walkthrough
          </div>
          <div className="space-y-1.5">
            <h2
              id="video-demo-heading"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              See VERIQ in 30 seconds
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              A recording will show the Lumen Harbor <strong className="font-semibold text-foreground">Example data</strong> scenario: inspect entered information, run the deterministic checks, and review the findings without private deal documents.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-background/70 p-4 text-left lg:max-w-xs">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-foreground">Video coming soon</p>
              <p className="text-xs leading-5 text-muted-foreground">
                No approved 30-second recording or video URL is included in this project yet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Until the recording is available, use the interactive example to see the same workflow end to end.
        </p>
        <LinkButton
          href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
          className="w-full sm:w-auto"
        >
          Use example data
        </LinkButton>
      </div>
    </section>
  );
}
