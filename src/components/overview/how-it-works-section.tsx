import { FilePlus2, Layers, CheckSquare2, AlertTriangle } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section aria-labelledby="how-it-works-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="how-it-works-heading"
          className="text-xs font-semibold uppercase tracking-wider text-primary"
        >
          Simple 3-step workflow
        </h2>
        <p className="text-xl font-bold tracking-tight text-foreground">
          How VERIQ works
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Step 1 */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-card/60 p-5 space-y-3 transition-colors hover:border-border/90">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold text-primary/40">
              01
            </span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FilePlus2 className="size-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              1. Paste what the seller told you
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Enter the target company name, claimed share class, quantity offered, quoted price per share, and seller name.
            </p>

            {/* Representative UI micro-component */}
            <div className="rounded border border-border/70 bg-background/60 p-2.5 text-[11px] space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Claimed security:</span>
                <span className="font-medium text-foreground">Common Stock</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Quoted price:</span>
                <span className="font-mono text-foreground">$18.00 / sh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-card/60 p-5 space-y-3 transition-colors hover:border-border/90">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold text-primary/40">
              02
            </span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Layers className="size-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              2. Attach or type the paperwork
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Add transfer agreements, cap table excerpts, or wire worksheets. Enter the structured terms (instrument, transfer consent, pricing).
            </p>

            {/* Representative UI micro-component */}
            <div className="rounded border border-border/70 bg-background/60 p-2.5 text-[11px] space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Agreement type:</span>
                <span className="font-medium text-foreground">SPV Transfer Memo</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Transfer condition:</span>
                <span className="text-[#F5B84B] font-medium">Issuer Approval</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative flex flex-col justify-between rounded-xl border border-border bg-card/60 p-5 space-y-3 transition-colors hover:border-border/90">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold text-primary/40">
              03
            </span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <CheckSquare2 className="size-4" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              3. See the mismatches in plain English
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Run checks to evaluate findings. See what differs, why it matters, and what to ask the seller before proceeding.
            </p>

            {/* Representative UI micro-component */}
            <div className="rounded border border-[#F5B84B]/40 bg-[#F5B84B]/5 p-2.5 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#F5B84B]">
                <AlertTriangle className="size-3 shrink-0" />
                <span>Attention: Security Mismatch</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Offered direct common stock, but agreement conveys SPV interest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
