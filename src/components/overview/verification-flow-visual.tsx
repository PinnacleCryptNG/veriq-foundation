import Link from "next/link";
import { ArrowRight, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
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
            Real-world example
          </h2>
          <p className="text-xl font-bold tracking-tight text-foreground">
            How VERIQ catches deal mismatches
          </p>
        </div>
        <Link
          href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
          className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          Open this review in the guided demo
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Clear 3-step story container */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Step 1: What seller claims */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-background/60 p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                1 · What the seller pitched
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                Seller Email / Pitch
              </span>
            </div>

            <div className="rounded-lg border border-border/80 bg-card/90 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Offered Security:</span>
                <span className="font-semibold text-foreground">Direct Common Stock</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">Lumen Harbor (Demo)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quoted Price:</span>
                <span className="font-mono text-foreground">$18.00 / share</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            The broker pitches direct cap table equity in a fast-growing private firm.
          </p>
        </div>

        {/* Step 2: What documents describe */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-background/60 p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                2 · What evidence describes
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                Submitted Document
              </span>
            </div>

            <div className="rounded-lg border border-border/80 bg-card/90 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Document Type:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <FileText className="size-3 text-primary" />
                  SPV Transfer Agreement
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Actual Instrument:</span>
                <span className="font-semibold text-[#F5B84B]">Indirect SPV Units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transfer Restriction:</span>
                <span className="font-semibold text-[#F5B84B]">Issuer Approval Required</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            The actual contract governs an intermediary LLC subject to strict company transfer vetoes.
          </p>
        </div>

        {/* Step 3: What VERIQ flags */}
        <div className="relative flex flex-col justify-between rounded-xl border border-[#F5B84B]/40 bg-[#F5B84B]/5 p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-[#F5B84B] uppercase">
                3 · What VERIQ spots
              </span>
              <span className="rounded bg-[#F5B84B]/20 px-2 py-0.5 text-[10px] font-semibold text-[#F5B84B]">
                Immediate Alert
              </span>
            </div>

            <div className="rounded-lg border border-[#F5B84B]/30 bg-card/90 p-3 space-y-2 text-xs">
              <div className="flex items-start gap-1.5 font-semibold text-[#F5B84B]">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>Security representation mismatch</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The seller offered direct common stock, but the paperwork places you into an indirect SPV fund with manager carry and unconfirmed transfer rights.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            You catch the mismatch <span className="text-foreground font-medium">before</span> wiring funds or signing binding transfer papers.
          </p>
        </div>
      </div>

      {/* Clear Trust Boundary */}
      <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/80 p-3.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-foreground">How VERIQ protects you: </span>
          VERIQ checks entered information against structured rules to highlight contradictions, missing numbers, and hidden restrictions. It does not replace independent legal diligence, authenticate uploaded PDFs, or guarantee investment quality.
        </p>
      </div>
    </section>
  );
}
