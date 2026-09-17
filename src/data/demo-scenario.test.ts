import { describe, expect, it } from "vitest";
import { demoOpportunities, DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import { evaluateOpportunity } from "@/engine/run";
import { toEngineInput } from "@/lib/to-engine-input";
import type { Finding } from "@/types/verification";

function byRule(findings: Finding[]) {
  return Object.fromEntries(findings.map((finding) => [finding.ruleId, finding]));
}

describe("Lumen Harbor synthetic demo scenario", () => {
  const opportunity = demoOpportunities.find((item) => item.id === DEMO_SCENARIO_ID);

  it("is labeled synthetic demo data", () => {
    if (!opportunity) {
      throw new Error("missing lumen demo");
    }
    expect(opportunity.isDemo).toBe(true);
    expect(opportunity.source).toBe("Synthetic demo scenario");
    expect(opportunity.claimedSummary.toLowerCase()).toContain("synthetic");
    expect(
      opportunity.evidence.every((item) =>
        item.displayName.toLowerCase().includes("synthetic demo"),
      ),
    ).toBe(true);
  });

  it("produces attention, consistent, and insufficient-evidence findings", () => {
    if (!opportunity) {
      throw new Error("missing lumen demo");
    }
    const result = evaluateOpportunity(toEngineInput(opportunity));
    const findings = byRule(result.findings);

    expect(findings.R01.state).toBe("attention");
    expect(findings.R01.evidenceIds).toEqual(["evd_demo_lumen_spv"]);
    expect(findings.R02.state).toBe("attention");
    expect(findings.R02.evidenceIds).toEqual(["evd_demo_lumen_transfer"]);
    expect(findings.R03.state).toBe("consistent");
    expect(findings.R03.evidenceIds).toEqual(["evd_demo_lumen_valuation"]);
    expect(findings.R04.state).toBe("insufficient_evidence");
    expect(findings.R04.evidenceIds).toEqual(["evd_demo_lumen_tx"]);
    expect(findings.R05.state).toBe("insufficient_evidence");

    expect(result.summary.attention).toBe(2);
    expect(result.summary.consistent).toBe(1);
    expect(result.summary.insufficient_evidence).toBe(2);
    expect(result.summary.not_assessed).toBe(0);

    for (const finding of result.findings) {
      for (const evidenceId of finding.evidenceIds) {
        expect(opportunity.evidence.some((item) => item.id === evidenceId)).toBe(
          true,
        );
      }
      expect(finding.explanation.toLowerCase()).not.toMatch(
        /verified|fraud-free|legitimate|approved|safe investment/,
      );
    }
  });

  it("checks arithmetic once a stated payment of 7225.00 is entered", () => {
    if (!opportunity) {
      throw new Error("missing lumen demo");
    }
    const input = toEngineInput(opportunity);
    const withPayment = {
      ...input,
      evidence: input.evidence.map((item) =>
        item.id === "evd_demo_lumen_tx"
          ? {
              ...item,
              details: {
                ...item.details,
                transaction: {
                  quantity: "400",
                  unitPrice: "18.00",
                  currency: "USD" as const,
                  fees: "25.00",
                  statedTotal: "7225.00",
                },
              },
            }
          : item,
      ),
    };
    const result = evaluateOpportunity(withPayment);
    const findings = byRule(result.findings);
    expect(findings.R04.state).toBe("consistent");
    expect(findings.R05.state).toBe("consistent");
    expect(findings.R01.state).toBe("attention");
  });

  it("keeps findings identical for identical demo inputs", () => {
    if (!opportunity) {
      throw new Error("missing lumen demo");
    }
    const input = toEngineInput(opportunity);
    expect(evaluateOpportunity(input).findings).toEqual(
      evaluateOpportunity(input).findings,
    );
  });
});
