import { describe, expect, it } from "vitest";
import { getFindingBuyerGuidance } from "@/lib/finding-buyer-guidance";
import type { Finding } from "@/types/verification";

describe("finding buyer guidance", () => {
  it("provides clear answers to what differs, why it matters, and next action for R01 Attention", () => {
    const finding: Finding = {
      id: "finding-R01",
      ruleId: "R01",
      category: "security_representation",
      title: "Claimed security type conflicts with structured evidence",
      state: "attention",
      explanation: "Explanation text",
      comparedFields: ["opportunity.instrument"],
      evidenceIds: ["evd_1"],
      missingInformation: [],
      limitation: "Limitation text",
    };

    const guidance = getFindingBuyerGuidance(finding);
    expect(guidance.differsOrMissing).toContain("seller pitched direct");
    expect(guidance.whyItMatters).toContain("SPV");
    expect(guidance.nextAction).toContain("Ask the seller");
  });

  it("provides clear answers for R04 Insufficient Evidence", () => {
    const finding: Finding = {
      id: "finding-R04",
      ruleId: "R04",
      category: "transaction_arithmetic",
      title: "Transaction fields incomplete",
      state: "insufficient_evidence",
      explanation: "Explanation text",
      comparedFields: [],
      evidenceIds: [],
      missingInformation: ["stated payment"],
      limitation: "Limitation text",
    };

    const guidance = getFindingBuyerGuidance(finding);
    expect(guidance.differsOrMissing).toContain("Transaction arithmetic cannot be verified");
    expect(guidance.whyItMatters).toContain("transaction fees");
    expect(guidance.nextAction).toContain("Complete the transaction worksheet");
  });
});
