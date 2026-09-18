import Link from "next/link";
import { ArrowRight, AlertTriangle, HelpCircle, FileText, ShieldAlert } from "lucide-react";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";

export function VerificationFlowVisual() {
  return (
    <section
      aria-labelledby="flow-visual-heading"
      className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div className="space-y-1">
          <h2
            id="flow-visual-heading"
            className="text-xs font-semibold uppercase tracking-wider text-primary"
          >
            How VERIQ evaluates deals
          </h2>
          <p className="text-lg font-semibold text-foreground">
            Claim → Evidence → Result in practice
          </p>
        </div>
        <Link
          href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          View live in Lumen Harbor review
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* 3-column card pipeline */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Step 1: Claim */}
        <div className="relative rounded-xl border border-border bg-background/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              1 · Claimed deal terms
            </span>
            <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
              Offered packet
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Company</p>
            <p className="text-sm font-semibold text-foreground">
              Lumen Harbor Analytics (Synthetic)
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-card/80 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Claimed security</span>
              <span className="font-semibold text-foreground">Common stock</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity offered</span>
              <span className="font-mono text-foreground">400 shares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quoted price</span>
              <span className="font-mono text-foreground">USD 18.00 / share</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stated deal size</span>
              <span className="font-mono text-foreground">USD 7,225.00</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Extracted directly from broker emails, pitch decks, or seller memos.
          </p>
        </div>

        {/* Step 2: Entered Structured Evidence */}
        <div className="relative rounded-xl border border-border bg-background/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              2 · Entered evidence
            </span>
            <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
              Reviewer-entered
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Uploaded & structured</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="size-4 text-primary" />
              <span>SPV Interest Memo & Terms</span>
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-card/80 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Instrument described</span>
              <span className="font-semibold text-[#F5B84B]">SPV interest (not direct stock)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transfer terms</span>
              <span className="font-semibold text-[#F5B84B]">Issuer approval required</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asking-price comp</span>
              <span className="font-semibold text-[#25D0A5]">USD 18.00 / unit (matches)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction fees</span>
              <span className="font-mono text-foreground">USD 25.00 fee noted</span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Reviewer types structured values directly from received documents.
          </p>
        </div>

        {/* Step 3: Deterministic Result */}
        <div className="relative rounded-xl border border-border bg-background/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              3 · Deterministic findings
            </span>
            <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Ruleset 2026.09.1
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Engine check</p>
            <p className="text-sm font-semibold text-foreground">
              5 transparent rule comparisons
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {/* Attention finding */}
            <div className="rounded-lg border border-[#F5B84B]/30 bg-[#F5B84B]/10 p-2.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#F5B84B]">
                <AlertTriangle className="size-3.5" />
                <span>R01 · Attention (Security Mismatch)</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Seller offered direct common stock, but the structured memo establishes an indirect SPV interest.
              </p>
            </div>

            {/* Insufficient finding */}
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <HelpCircle className="size-3.5" />
                <span>R04 · Insufficient Evidence</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Stated payment missing until reviewer entered 7,225.00 (400 × 18.00 + 25.00 fees).
              </p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Clear, citeable findings with exact arithmetic and field citations.
          </p>
        </div>
      </div>

      {/* Trust & Boundary note */}
      <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/80 p-3.5 text-xs text-muted-foreground">
        <ShieldAlert className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-medium text-foreground">Objective finding boundary: </span>
          VERIQ surfaces what is mathematically supported, missing, or contradictory between
          claimed deal terms and entered structured evidence. It does not certify ownership,
          guarantee future returns, or replace independent legal, tax, or investment counsel.
        </p>
      </div>
    </section>
  );
}
