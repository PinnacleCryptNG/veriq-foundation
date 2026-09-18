import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import { LinkButton } from "@/components/link-button";

export function HomepageHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 via-card/60 to-background/50 p-6 sm:p-10 lg:p-12">
      {/* Subtle background ambient blue glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 h-72 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl text-center space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          <span>Private Market Secondary Due Diligence</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
          Spot the mismatches before you send money.
        </h1>

        <p className="text-base text-foreground/90 sm:text-lg sm:leading-relaxed font-normal">
          Spot the mismatches between what the seller told you and what the available
          evidence supports — before you send money.
        </p>

        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          See exactly what security, ownership, valuation, rights and transfer conditions
          are supported by evidence. Built for individual buyers evaluating pre-IPO shares
          or secondary deals, with an objective checklist for review desks.
        </p>

        {/* Action CTAs: Try the live demo is the featured primary action */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <LinkButton
            href={`/opportunities/${DEMO_SCENARIO_ID}`}
            size="lg"
            className="h-11 px-6 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            Try the live demo
            <ArrowRight data-icon="inline-end" className="size-4" />
          </LinkButton>

          <LinkButton
            href="/opportunities/new"
            variant="outline"
            size="lg"
            className="h-11 px-6 text-sm font-medium"
          >
            Start verification
          </LinkButton>
        </div>

        {/* Reassuring trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-[#25D0A5]" />
            Plain-English findings
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" />
            Zero AI guesswork
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-[#F5B84B]" />
            Independent evidence cross-check
          </span>
        </div>
      </div>
    </section>
  );
}
