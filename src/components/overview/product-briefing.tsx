import { siteConfig } from "@/config/site";

const briefing = [
  {
    title: "What it is",
    body: `${siteConfig.name} is a local review workspace for private and pre-IPO equity opportunity packets. It runs deterministic checks on claimed terms and reviewer-entered structured evidence under ruleset 2026.09.1.`,
  },
  {
    title: "Who it is for",
    body: "Analysts and reviewers who need a repeatable way to compare a claimed packet with the values they can actually enter — before treating those claims as settled.",
  },
  {
    title: "Problem it addresses",
    body: "Private-market packets often mix conflicting descriptions, incomplete figures, and missing fields. VERIQ makes those comparisons explicit. It does not replace issuer confirmation, legal review, or investment diligence.",
  },
  {
    title: "What you can do",
    body: "Capture an opportunity, attach evidence records, enter structured values, follow input-completeness guidance, run checks, and optionally attach a PreStocks catalog row as market context. Re-run after an edit; earlier snapshots stay in Review history.",
  },
  {
    title: "What this demo shows",
    body: "Lumen Harbor Analytics is a synthetic packet, not a real company. The first Run checks pass should mix Attention, Consistent, and Insufficient evidence. Enter stated payment 7225.00 on the transaction worksheet, re-run, and open the earlier run in Review history.",
  },
  {
    title: "Outside this implementation",
    body: "No AI extraction, issuer lookup, authentication, trading, wallet, marketplace, scores, or “Verified” badge. PreStocks is a read-only catalog reference. Findings do not prove ownership, authenticity, legitimacy, safety, or investment quality. Browser localStorage is demo-only.",
  },
] as const;

export function ProductBriefing({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <details className="group rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60">
        <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground">
          <span>About this workspace · Technical specification</span>
          <span className="text-primary text-xs normal-case group-open:hidden">
            Show details →
          </span>
          <span className="text-muted-foreground text-xs normal-case hidden group-open:inline">
            Hide details ↑
          </span>
        </summary>
        <div className="mt-4 pt-3 border-t border-border/60 space-y-3">
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {briefing.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-border/80 bg-background/50 p-3"
              >
                <h3 className="text-xs font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </details>
    );
  }

  return (
    <section aria-labelledby="product-briefing-heading" className="space-y-3">
      <div className="space-y-1">
        <h2
          id="product-briefing-heading"
          className="text-sm font-medium text-foreground"
        >
          About this workspace
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {siteConfig.description}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {briefing.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
