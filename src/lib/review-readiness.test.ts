import { describe, expect, it } from "vitest";
import { demoOpportunities, DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import { assessReviewReadiness } from "@/lib/review-readiness";
import { toEngineInput } from "@/lib/to-engine-input";

describe("review readiness", () => {
  it("treats empty evidence as needing structured values, not a verdict", () => {
    const helion = demoOpportunities.find((item) => item.id === "opp_demo_helion");
    if (!helion) {
      throw new Error("missing helion demo");
    }
    const readiness = assessReviewReadiness(helion);
    expect(readiness.needsInputCount).toBeGreaterThan(0);
    expect(readiness.checks.every((check) => check.status !== undefined)).toBe(
      true,
    );
    expect(
      JSON.stringify(readiness).toLowerCase(),
    ).not.toMatch(/verified|risk score|legitimate/);
  });

  it("marks Lumen Harbor checks with mixed ready and missing input", () => {
    const lumen = demoOpportunities.find((item) => item.id === DEMO_SCENARIO_ID);
    if (!lumen) {
      throw new Error("missing lumen demo");
    }
    const readiness = assessReviewReadiness(lumen);
    const byRule = Object.fromEntries(
      readiness.checks.map((check) => [check.ruleId, check]),
    );
    expect(byRule.R01.status).toBe("ready");
    expect(byRule.R02.status).toBe("ready");
    expect(byRule.R03.status).toBe("ready");
    expect(byRule.R04.status).toBe("needs_input");
    expect(byRule.R05.status).toBe("needs_input");
    expect(byRule.R04.missing.join(" ")).toMatch(/stated payment/i);
    expect(byRule.R01.evidenceIds).toEqual(["evd_demo_lumen_spv"]);
    expect(toEngineInput(lumen).evidence).toHaveLength(4);
  });
});
