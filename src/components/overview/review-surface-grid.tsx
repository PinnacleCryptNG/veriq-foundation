import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviewSurfaces } from "@/config/review-surfaces";

export function ReviewSurfaceGrid() {
  return (
    <section aria-labelledby="review-surfaces-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="review-surfaces-heading"
          className="text-xs font-semibold uppercase tracking-wider text-primary"
        >
          Ruleset 2026.09.1
        </h2>
        <p className="text-xl font-bold tracking-tight text-foreground">
          Implemented checks · ruleset 2026.09.1
        </p>
        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          After you run checks, findings appear in the review workspace. They
          compare entered claims with entered structured values. They do not
          establish ownership, authenticity, or investment quality.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {reviewSurfaces.map((surface) => (
          <Card key={surface.id} size="sm" className="bg-card/60 border-border transition-colors hover:border-border/90">
            <CardHeader className="pb-2">
              <span className="text-[11px] font-mono font-bold text-primary">
                {surface.id}
              </span>
              <CardTitle className="text-sm font-semibold">{surface.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-5 text-muted-foreground">
                {surface.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
