import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviewSurfaces } from "@/config/review-surfaces";
import { Info } from "lucide-react";

export function ReviewSurfaceGrid() {
  return (
    <section aria-labelledby="review-surfaces-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="review-surfaces-heading"
          className="text-xs font-semibold uppercase tracking-wider text-primary"
        >
          Verification checks
        </h2>
        <p className="text-xl font-bold tracking-tight text-foreground">
          What VERIQ checks automatically
        </p>
        <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
          Every deal is evaluated across five fundamental buyer questions to spot hidden risks before money changes hands.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {reviewSurfaces.map((surface, idx) => (
          <Card key={surface.id} size="sm" className="bg-card/60 border-border transition-colors hover:border-border/90 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <span className="text-[11px] font-mono font-bold text-primary">
                Check 0{idx + 1}
              </span>
              <CardTitle className="text-sm font-semibold">{surface.buyerQuestion}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {surface.plainDescription}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 15. Move R01-R05 identifiers, ruleset version, and technical implementation behind disclosure */}
      <details className="group rounded-xl border border-border bg-card/30 p-3.5 transition-colors hover:bg-card/50">
        <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-1.5">
            <Info className="size-3.5 text-primary" />
            Implemented checks · ruleset 2026.09.1 (R01–R05 details)
          </span>
          <span className="text-primary text-[11px] group-open:hidden">
            Show exact checks →
          </span>
          <span className="text-muted-foreground text-[11px] hidden group-open:inline">
            Hide exact checks ↑
          </span>
        </summary>
        <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Deterministic engine specification</span>
            <span className="font-mono text-foreground">Ruleset 2026.09.1</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            {reviewSurfaces.map((surface) => (
              <div key={surface.id} className="rounded-lg border border-border/70 bg-background/50 p-2.5 space-y-1">
                <span className="font-mono font-bold text-primary text-[11px]">
                  {surface.id} · {surface.title}
                </span>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {surface.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
