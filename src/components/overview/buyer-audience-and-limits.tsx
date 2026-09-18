import { UserCheck, Building2, Briefcase, XCircle } from "lucide-react";

export function BuyerAudienceAndLimits() {
  return (
    <div className="space-y-6 pt-4 border-t border-border/80">
      {/* 26. Who is VERIQ for? */}
      <section aria-labelledby="who-is-veriq-for-heading" className="space-y-4">
        <div className="space-y-1">
          <h2
            id="who-is-veriq-for-heading"
            className="text-xs font-semibold uppercase tracking-wider text-primary"
          >
            Audience & Use Cases
          </h2>
          <p className="text-xl font-bold tracking-tight text-foreground">
            Who is VERIQ for?
          </p>
          <p className="text-xs text-muted-foreground">
            Built for private-market secondary buyers and diligence workflows.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <UserCheck className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Individual Secondary Buyers
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Buying pre-IPO shares or tender rights. Cross-check broker emails and tear-sheets against the actual purchase agreement before wiring funds.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Building2 className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Family Offices & Angels
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Conducting structured first-pass reviews across incoming private secondary offerings to spot instrument mismatches and missing terms early.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Briefcase className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Brokers & Review Desks
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Preparing transparent, organized deal packets with clear evidence traceability before presenting opportunities to prospective buyers.
            </p>
          </div>
        </div>
      </section>

      {/* 27. What VERIQ is not */}
      <section aria-labelledby="what-veriq-is-not-heading" className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h2
            id="what-veriq-is-not-heading"
            className="text-xs font-semibold uppercase tracking-wider text-[#EF5B6B]"
          >
            Product Boundaries
          </h2>
          <p className="text-lg font-bold tracking-tight text-foreground">
            What VERIQ is not
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <XCircle className="size-4 text-[#EF5B6B] shrink-0" />
              <span>Not legal counsel</span>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              VERIQ compares entered text and numbers against explicit structured rules. It does not replace independent attorney advice, contract review, or tax diligence.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <XCircle className="size-4 text-[#EF5B6B] shrink-0" />
              <span>Not a valuation service</span>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              A Consistent price check simply means the quoted price aligns mathematically with an entered benchmark sheet. It is not an appraisal or fair-market-value opinion.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/60 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <XCircle className="size-4 text-[#EF5B6B] shrink-0" />
              <span>Not a PDF authenticator</span>
            </div>
            <p className="leading-relaxed text-muted-foreground">
              VERIQ does not perform digital forensics, OCR authentication, or direct cap table audits. It checks user-entered structured values for internal consistency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
