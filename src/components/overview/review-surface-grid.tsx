import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviewSurfaces } from "@/config/review-surfaces";

export function ReviewSurfaceGrid() {
  return (
    <section aria-labelledby="review-surfaces-heading" className="space-y-3">
      <div className="space-y-1">
        <h2
          id="review-surfaces-heading"
          className="text-sm font-medium text-foreground"
        >
          Implemented checks · ruleset 2026.09.1
        </h2>
        <p className="text-sm text-muted-foreground">
          After you run checks, findings appear in the review workspace. They
          compare entered claims with entered structured values. They do not
          establish ownership, authenticity, or investment quality.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {reviewSurfaces.map((surface) => (
          <Card key={surface.id} size="sm" className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-sm">{surface.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-5 text-muted-foreground">
                {surface.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
