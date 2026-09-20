import { ArrowRight, BadgeCheck, CheckCircle2, ShieldAlert } from "lucide-react";
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
          <BadgeCheck className="size-3.5" />
          <span>Private-Market Deal Verification</span>
        </div>

        {/* 1. H1 naming VERIQ and concrete problem in plain English */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
          VERIQ spots private-share deal mismatches before you send money.
        </h1>

        {/* 2. Concise subheading: intended user + what they can do in 30 seconds */}
        <p className="text-base text-foreground/90 sm:text-lg sm:leading-relaxed font-normal">
          Built for private-market buyers: cross-check seller claims against underlying documents, spot hidden SPV structures, and catch missing wire arithmetic in about 30 seconds.
        </p>

        {/* Supporting sentence explaining what VERIQ does */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Spot the mismatches between what the seller told you and what the available
          evidence supports — before you send money.
        </p>

        {/* 3. Dominant primary CTA: Run the 2-minute demo now + secondary Start a new deal check */}
        <div className="flex flex-col items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center">
          <LinkButton
            href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
            size="lg"
            className="h-12 w-full px-7 text-sm font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-[1.01] hover:shadow-primary/35 sm:w-auto"
          >
            Run the 2-minute demo now
            <ArrowRight data-icon="inline-end" className="size-4" />
          </LinkButton>

          <LinkButton
            href="/opportunities/new"
            variant="outline"
            size="lg"
            className="h-12 w-full px-6 text-sm font-medium border-border/80 hover:bg-muted/50 sm:w-auto"
          >
            Start a new deal check
          </LinkButton>
        </div>

        <p className="text-xs text-muted-foreground">
          Clicking opens the Lumen Harbor guided review with pre-loaded demo evidence. No signup or wallet required.
        </p>

        {/* 7. Three concise buyer benefits near hero */}
        <div className="grid gap-4 pt-5 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <CheckCircle2 className="size-3.5 text-[#25D0A5] shrink-0" />
              Know what you’re buying
            </span>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Catch whether you are receiving direct company stock or an indirect SPV membership unit with manager fees.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <ShieldAlert className="size-3.5 text-[#F5B84B] shrink-0" />
              Spot transfer lockups
            </span>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Find out if company approval or Right of First Refusal waivers are required before money leaves your account.
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <CheckCircle2 className="size-3.5 text-primary shrink-0" />
              Audit the wire math
            </span>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Verify share quantity, unit price, and broker fees down to the exact penny before wiring capital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
