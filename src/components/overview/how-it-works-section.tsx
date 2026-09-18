import { FilePlus2, Layers, CheckSquare2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Describe the opportunity",
    description:
      "Capture the seller's claimed company name, instrument (common, preferred, SAFE, SPV), share count, quoted price, and currency.",
    icon: FilePlus2,
  },
  {
    number: "02",
    title: "Add available evidence",
    description:
      "Attach seller agreements, cap table excerpts, or worksheets. Type key structured details (transfer restrictions, pricing, payment totals).",
    icon: Layers,
  },
  {
    number: "03",
    title: "Review findings & gaps",
    description:
      "Run automated checks to see exact Consistent, Attention, and Insufficient evidence findings in plain English. Catch hidden fees and security mismatches early.",
    icon: CheckSquare2,
  },
] as const;

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
          How it works
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative flex flex-col justify-between rounded-xl border border-border bg-card/60 p-5 space-y-3 transition-colors hover:border-border/90"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-primary/40">
                  {step.number}
                </span>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
