import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import type { Opportunity } from "@/types/opportunity";
import type { VerificationRun } from "@/types/verification";

export type WalkthroughSurface = "overview" | "detail" | "review";

export function lumenStatedPayment(opportunity: Opportunity): string | undefined {
  return opportunity.evidence.find((item) => item.id === "evd_demo_lumen_tx")
    ?.structuredDetails?.transaction?.statedTotal;
}

export function lumenWalkthroughCopy(args: {
  surface: WalkthroughSurface;
  opportunity?: Opportunity;
  latestRun?: VerificationRun | null;
  selectedRun?: VerificationRun | null;
}): { title: string; body: string; href?: string; action?: string } {
  const { surface, opportunity, latestRun, selectedRun } = args;
  const stated = opportunity ? lumenStatedPayment(opportunity) : undefined;
  const latestR04 = latestRun?.findings.find((finding) => finding.ruleId === "R04");
  const viewingHistory =
    Boolean(selectedRun && latestRun && selectedRun.id !== latestRun.id);

  if (surface === "overview") {
    return {
      title: "Suggested walkthrough",
      body: "Open Lumen Harbor Analytics, a synthetic packet, to compare claims with structured evidence. It is not a real company.",
      href: `/opportunities/${DEMO_SCENARIO_ID}`,
      action: "Open Lumen Harbor Analytics",
    };
  }

  if (surface === "detail") {
    if (!latestRun) {
      return {
        title: "Next in the walkthrough",
        body: "Read the claimed terms, evidence records, and missing structured fields. Then open the review workspace and run checks.",
        href: `/opportunities/${DEMO_SCENARIO_ID}/review`,
        action: "Open review workspace",
      };
    }
    if (latestR04?.state === "insufficient_evidence" && !stated) {
      return {
        title: "Next in the walkthrough",
        body: "On the transaction worksheet, enter stated payment 7225.00 from the synthetic figures (400 × 18.00 + 25.00), save, then run checks again.",
      };
    }
    return {
      title: "Next in the walkthrough",
      body: "Return to the review workspace. Re-run checks if you changed structured values, then open the earlier run in history.",
      href: `/opportunities/${DEMO_SCENARIO_ID}/review`,
      action: "Open review workspace",
    };
  }

  if (!latestRun) {
    return {
    title: "Guided review ready to run",
    body: "You are about to evaluate Lumen Harbor: 400 common shares offered at $18.00. Click 'Run checks' or 'Run checks now' below to compare seller claims with entered SPV paperwork and inspect the findings.",
    action: "Run checks",
    };
  }

  if (viewingHistory) {
    return {
      title: "Historical snapshot",
      body: "This earlier run stays as it was. Editing evidence or running checks again does not change it.",
    };
  }

  if (latestR04?.state === "insufficient_evidence" && !stated) {
    return {
      title: "Next in the walkthrough",
      body: "Follow a finding to the transaction worksheet, enter stated payment 7225.00, save, and run checks again.",
      href: `/opportunities/${DEMO_SCENARIO_ID}#evidence-evd_demo_lumen_tx`,
      action: "Open transaction worksheet",
    };
  }

  return {
    title: "Next in the walkthrough",
    body: "Open the earlier run in Review history. That snapshot should still show the missing stated payment.",
  };
}
