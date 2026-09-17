import { describe, expect, it } from "vitest";
import { resolveComparedValues } from "@/lib/compared-values";
import type { EngineInput } from "@/types/verification";

const input: EngineInput = {
  opportunity: {
    id: "opp_x",
    instrument: "common_stock",
    quotedPrice: "18.00",
    currency: "USD",
  },
  evidence: [
    {
      id: "evd_x",
      details: { securityType: "spv_interest" },
    },
  ],
};

describe("compared values", () => {
  it("resolves opportunity and evidence values from a snapshot", () => {
    const rows = resolveComparedValues(
      ["opportunity.instrument", "evidence[evd_x].details.securityType"],
      input,
    );
    expect(rows[0]?.value).toBe("Common stock");
    expect(rows[1]?.value).toBe("SPV interest");
    expect(rows[1]?.evidenceId).toBe("evd_x");
  });

  it("does not invent evidence when none was used", () => {
    const rows = resolveComparedValues(
      ["opportunity claims only; no evidence records were supplied"],
      input,
    );
    expect(rows[0]?.value).toMatch(/no evidence record/i);
  });
});
