import { describe, expect, it } from "vitest";
import { filterPreStocksAssets, suggestPreStocksMatches } from "@/lib/prestocks/match";
import { samplePreStocksAsset } from "@/lib/prestocks/fixtures";
import { buildMarketContext, MARKET_CONTEXT_LIMITATION } from "@/lib/prestocks/context";
import { demoOpportunities, DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import { evaluateOpportunity } from "@/engine/run";
import { toEngineInput } from "@/lib/to-engine-input";
import { RULESET_VERSION } from "@/types/verification";

const lumen = demoOpportunities.find((item) => item.id === DEMO_SCENARIO_ID);

describe("PreStocks matching and market context", () => {
  it("suggests OpenAI for an OpenAI opportunity name", () => {
    const matches = suggestPreStocksMatches("OpenAI", [samplePreStocksAsset]);
    expect(matches.map((item) => item.symbol)).toEqual(["OPENAI"]);
  });

  it("does not suggest a PreStocks row for Lumen Harbor Analytics", () => {
    expect(
      suggestPreStocksMatches("Lumen Harbor Analytics", [samplePreStocksAsset]),
    ).toEqual([]);
  });

  it("filters catalog search without requiring an extra API parameter", () => {
    expect(filterPreStocksAssets([samplePreStocksAsset], "open")).toHaveLength(1);
    expect(filterPreStocksAssets([samplePreStocksAsset], "anduril")).toHaveLength(0);
  });

  it("labels submitted values and PreStocks fields as different sources", () => {
    if (!lumen) throw new Error("missing lumen");
    const context = buildMarketContext({
      opportunity: lumen,
      asset: samplePreStocksAsset,
      retrievedAt: "2026-09-17T12:00:00.000Z",
      freshness: "live",
      sourceUrl: "https://prestocks.com/api/prestocks",
    });
    expect(context.rows.some((row) => row.submitted.includes("Lumen Harbor"))).toBe(
      true,
    );
    expect(context.rows.some((row) => row.market.includes("OPENAI"))).toBe(true);
    expect(context.limitation).toBe(MARKET_CONTEXT_LIMITATION);
    expect(context.limitation.toLowerCase()).toMatch(/does not feed ruleset 2026\.09\.1/);
    expect(context.limitation.toLowerCase()).toMatch(
      /does not say the opportunity is fair, overpriced, underpriced, safe, or verified/,
    );
  });

  it("does not change Lumen first-run rule states when a PreStocks asset exists", () => {
    if (!lumen) throw new Error("missing lumen");
    const result = evaluateOpportunity(toEngineInput(lumen));
    expect(result.rulesetVersion).toBe(RULESET_VERSION);
    const states = Object.fromEntries(
      result.findings.map((finding) => [finding.ruleId, finding.state]),
    );
    expect(states).toEqual({
      R01: "attention",
      R02: "attention",
      R03: "consistent",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    });
    expect(JSON.stringify(result)).not.toMatch(/prestocks|tokenPrice/i);
  });
});
