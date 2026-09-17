import { describe, expect, it } from "vitest";
import { evaluateOpportunity } from "@/engine/run";
import { verificationFixtures } from "@/engine/fixtures";
import { formatMoneyMinor, multiplyQuantityByUnitPrice, parseMoney, parseQuantity } from "@/engine/money";
import type { Finding } from "@/types/verification";

function findingsByRule(findings: Finding[]) {
  return Object.fromEntries(findings.map((finding) => [finding.ruleId, finding]));
}

describe("decimal arithmetic", () => {
  it("parses money without floating point", () => {
    expect(parseMoney("2.50")).toEqual({ ok: true, minor: BigInt(250) });
    expect(parseMoney("2.5")).toEqual({ ok: true, minor: BigInt(250) });
    expect(parseMoney("260.00")).toEqual({ ok: true, minor: BigInt(26000) });
  });

  it("rejects excess money precision", () => {
    expect(parseMoney("2.501").ok).toBe(false);
  });

  it("computes 100 × 2.50 + 10.00 = 260.00 using integer minor units", () => {
    const quantity = parseQuantity("100");
    const price = parseMoney("2.50");
    const fees = parseMoney("10.00");
    if (!quantity.ok || !price.ok || !fees.ok) {
      throw new Error("parse failed");
    }
    const expected = multiplyQuantityByUnitPrice(quantity.minor, price.minor) + fees.minor;
    expect(formatMoneyMinor(expected)).toBe("260.00");
  });
});

describe("verification fixtures", () => {
  it.each(verificationFixtures)("$label", (fixture) => {
    const result = evaluateOpportunity(fixture.input);
    const byRule = findingsByRule(result.findings);

    for (const [ruleId, state] of Object.entries(fixture.expectedStates)) {
      expect(byRule[ruleId]?.state, `${ruleId} state`).toBe(state);
    }

    for (const [ruleId, evidenceIds] of Object.entries(fixture.expectedEvidenceIds)) {
      expect(byRule[ruleId]?.evidenceIds, `${ruleId} evidence`).toEqual(evidenceIds);
    }

    for (const finding of result.findings) {
      for (const evidenceId of finding.evidenceIds) {
        expect(
          fixture.input.evidence.some((item) => item.id === evidenceId),
          `${finding.ruleId} referenced unknown evidence ${evidenceId}`,
        ).toBe(true);
      }
      expect(finding.explanation.toLowerCase()).not.toMatch(
        /verified|fraud-free|legitimate|approved|safe investment|proves fraud/,
      );
    }
  });

  it("produces identical findings for identical inputs aside from run metadata", () => {
    const fixture = verificationFixtures[1];
    const first = evaluateOpportunity(fixture.input);
    const second = evaluateOpportunity(fixture.input);
    expect(first.findings).toEqual(second.findings);
    expect(first.summary).toEqual(second.summary);
    expect(first.rulesetVersion).toEqual(second.rulesetVersion);
  });

  it("does not treat missing evidence as a positive confirmation", () => {
    const result = evaluateOpportunity({
      opportunity: {
        id: "opp_empty",
        instrument: "preferred_stock",
      },
      evidence: [],
    });
    expect(result.findings.every((finding) => finding.state !== "consistent")).toBe(
      true,
    );
    expect(
      result.findings.filter((finding) => finding.state === "insufficient_evidence")
        .length,
    ).toBeGreaterThan(0);
  });
});
