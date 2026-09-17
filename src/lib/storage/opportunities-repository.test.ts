import { describe, expect, it } from "vitest";
import { demoOpportunities, DEMO_SCENARIO_ID } from "@/data/demo-opportunities";
import {
  mergeWithDemoSeeds,
  parseStoredOpportunities,
  emptyOpportunitiesResult,
  getServerOpportunitiesSnapshot,
} from "@/lib/storage/opportunities-repository";
import type { Opportunity } from "@/types/opportunity";

const userOpportunity: Opportunity = {
  id: "opp_user_cedar",
  companyName: "Cedar Point Labs",
  instrument: "preferred_stock",
  sellerOrIntermediary: "Inlet Desk",
  quantityOffered: "50",
  quotedPrice: "10.00",
  currency: "USD",
  claimedSummary: "User-created record that must remain after demo seeds merge.",
  source: "Direct intake",
  status: "evidence_pending",
  missingMaterials: [],
  limitationNote: "Local demo record.",
  evidence: [],
  createdAt: "2026-09-17T11:00:00.000Z",
  updatedAt: "2026-09-17T11:00:00.000Z",
  isDemo: false,
};

describe("opportunity storage recovery", () => {
  it("keeps valid records when some stored items are malformed", () => {
    const parsed = parseStoredOpportunities(
      JSON.stringify({
        version: 1,
        opportunities: [userOpportunity, { id: "broken" }],
      }),
    );
    expect(parsed.records.map((item) => item.id)).toEqual(["opp_user_cedar"]);
    expect(parsed.warning).toMatch(/skipped/);
  });

  it("recovers readable records when the storage version is unexpected", () => {
    const parsed = parseStoredOpportunities(
      JSON.stringify({
        version: 99,
        opportunities: [userOpportunity],
      }),
    );
    expect(parsed.records).toHaveLength(1);
    expect(parsed.records[0]?.companyName).toBe("Cedar Point Labs");
    expect(parsed.warning).toMatch(/unexpected storage version/);
  });

  it("does not treat unreadable JSON as an empty catalogue without a warning", () => {
    const parsed = parseStoredOpportunities("{not-json");
    expect(parsed.records).toEqual([]);
    expect(parsed.warning).toMatch(/unreadable/);
  });

  it("adds missing demo seeds without dropping user-created opportunities", () => {
    const merged = mergeWithDemoSeeds([userOpportunity]);
    expect(merged.some((item) => item.id === "opp_user_cedar")).toBe(true);
    expect(merged.some((item) => item.id === DEMO_SCENARIO_ID)).toBe(true);
    expect(merged).toHaveLength(1 + demoOpportunities.length);
  });

  it("serves seeded opportunities on the server instead of an empty loading sentinel", () => {
    const snapshot = getServerOpportunitiesSnapshot();
    expect(snapshot).not.toBe(emptyOpportunitiesResult);
    expect(snapshot.opportunities.map((item) => item.id)).toEqual(
      expect.arrayContaining([DEMO_SCENARIO_ID]),
    );
    expect(snapshot.opportunities.length).toBe(demoOpportunities.length);
    expect(snapshot.warning).toBeNull();
  });
});
