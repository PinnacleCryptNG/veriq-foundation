import { describe, expect, it } from "vitest";
import { engineInputsMatch } from "@/lib/engine-input";
import { lumenWalkthroughCopy } from "@/lib/lumen-walkthrough";
import { verificationStateHelp } from "@/lib/format";
import { DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import type { EngineInput, VerificationRun } from "@/types/verification";

const input: EngineInput = {
  opportunity: { id: "opp_x", instrument: "common_stock" },
  evidence: [],
};

const insufficientRun = {
  id: "run_1",
  opportunityId: DEMO_SCENARIO_ID,
  timestamp: "2026-09-17T10:00:00.000Z",
  rulesetVersion: "2026.09.1",
  findings: [
    {
      id: "finding-R04",
      ruleId: "R04",
      category: "transaction_arithmetic",
      title: "Incomplete",
      state: "insufficient_evidence",
      explanation: "Missing stated payment.",
      comparedFields: [],
      evidenceIds: ["evd_demo_lumen_tx"],
      missingInformation: ["stated payment"],
      limitation: "Demo limitation.",
    },
  ],
  summary: {
    consistent: 0,
    attention: 0,
    insufficient_evidence: 1,
    not_assessed: 0,
  },
} as VerificationRun;

describe("engine input snapshots", () => {
  it("treats identical structured inputs as a match", () => {
    expect(engineInputsMatch(input, { ...input, evidence: [] })).toBe(true);
  });

  it("detects a changed stated payment", () => {
    const next: EngineInput = {
      ...input,
      evidence: [
        {
          id: "evd_demo_lumen_tx",
          details: {
            transaction: {
              quantity: "400",
              unitPrice: "18.00",
              currency: "USD",
              statedTotal: "7225.00",
            },
          },
        },
      ],
    };
    expect(engineInputsMatch(input, next)).toBe(false);
  });
});

describe("trust language", () => {
  it("defines finding states without a verified, scored, or fraud-free outcome", () => {
    const text = Object.values(verificationStateHelp).join(" ").toLowerCase();
    expect(text).not.toMatch(/\bverified\b|risk score|fraud-free|approved result/);
    expect(text).toMatch(/not proof of fraud/);
    expect(text).toMatch(/missing/);
    expect(text).toMatch(/not a successful result/);
  });
});

describe("Lumen walkthrough copy", () => {
  it("points overview users at the synthetic scenario without loading replacement data", () => {
    const copy = lumenWalkthroughCopy({ surface: "overview" });
    expect(copy.href).toBe(`/opportunities/${DEMO_SCENARIO_ID}`);
    expect(copy.body.toLowerCase()).toContain("synthetic");
    expect(copy.action).not.toMatch(/load demo/i);
  });

  it("asks for stated payment 7225.00 after the mixed first run", () => {
    const copy = lumenWalkthroughCopy({
      surface: "review",
      latestRun: insufficientRun,
      selectedRun: insufficientRun,
      opportunity: {
        id: DEMO_SCENARIO_ID,
        companyName: "Lumen Harbor Analytics",
        instrument: "common_stock",
        sellerOrIntermediary: "Northglass",
        claimedSummary: "Synthetic demo packet.",
        source: "Synthetic demo scenario",
        status: "queued_for_review",
        missingMaterials: [],
        limitationNote: "Synthetic.",
        evidence: [
          {
            id: "evd_demo_lumen_tx",
            type: "transaction_agreement",
            displayName: "Transaction worksheet (synthetic demo)",
            createdAt: "2026-09-16T14:15:00.000Z",
            structuredDetails: {
              transaction: {
                quantity: "400",
                unitPrice: "18.00",
                currency: "USD",
                fees: "25.00",
              },
            },
          },
        ],
        createdAt: "2026-09-16T13:40:00.000Z",
        updatedAt: "2026-09-17T10:00:00.000Z",
        isDemo: true,
      },
    });
    expect(copy.body).toContain("7225.00");
  });
});
