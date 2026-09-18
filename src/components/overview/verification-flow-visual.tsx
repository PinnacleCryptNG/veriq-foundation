import Link from "next/link";
import { ArrowRight, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";

export function VerificationFlowVisual() {
  return (
    <section
      aria-labelledby="flow-visual-heading"
      className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 space-y-5"
    >
      {/* 5. Plain English one-sentence summary above example + clear label */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              This is what you’ll get
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Live Seeded Scenario · Lumen Harbor
            </span>
          </div>
          <h2
            id="flow-visual-heading"
            className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
          >
            A 30-second look at how VERIQ spots deal mismatches
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Here is what happens when you compare what a seller tells you against the paperwork they actually provide.
          </p>
        </div>
        <Link
          href={`/opportunities/${DEMO_SCENARIO_ID}/review`}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          Run this check in the live demo
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 6. Present example: What the seller said, what supplied information describes, and what VERIQ spots */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Step 1: What the seller said */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-background/60 p-4 sm:p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                1 · What the seller said
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                Broker Pitch
              </span>
            </div>

            <div className="rounded-lg border border-border/80 bg-card/90 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Offered Security:</span>
                <span className="font-semibold text-foreground">Direct Common Stock</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">Lumen Harbor Analytics</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quoted Price:</span>
                <span className="font-mono text-foreground">$18.00 / share (400 shares)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            The seller pitches direct ownership of 400 shares on the company cap table.
          </p>
        </div>

        {/* Step 2: What the supplied information describes */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-background/60 p-4 sm:p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                2 · What supplied information describes
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                Entered Document
              </span>
            </div>

            <div className="rounded-lg border border-border/80 bg-card/90 p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Document:</span>
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
            The agreement actually conveys units in an intermediary LLC subject to company veto.
          </p>
        </div>

        {/* Step 3: What VERIQ spots */}
        <div className="relative flex flex-col justify-between rounded-xl border border-[#F5B84B]/40 bg-[#F5B84B]/10 p-4 sm:p-5 space-y-3 shadow-sm">
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
                Seller claims common stock, but the paperwork describes an indirect SPV vehicle. Plus, the transaction worksheet is missing the stated wire payment amount.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            You catch the discrepancy <span className="text-foreground font-semibold">before</span> wiring funds or signing binding agreements.
          </p>
        </div>
      </div>

      {/* 17 & 18. Short, direct disclaimer with core limitation framing */}
      <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/80 p-3.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-foreground">How VERIQ protects you: </span>
          VERIQ surfaces mismatches in the information you provide. It doesn’t invent facts, authenticate documents, confirm legal ownership, or replace a lawyer.
        </p>
      </div>
    </section>
  );
}
