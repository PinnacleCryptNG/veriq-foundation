import { describe, expect, it } from "vitest";
import { reviewSurfaces } from "@/config/review-surfaces";
import { siteConfig } from "@/config/site";

describe("hackathon presentation copy", () => {
  it("describes VERIQ as a review workspace, not independent verification", () => {
    expect(siteConfig.tagline.toLowerCase()).toContain("review");
    expect(siteConfig.tagline.toLowerCase()).not.toMatch(
      /verification|fraud-proof|trustless|guaranteed/,
    );
    expect(siteConfig.description.toLowerCase()).toContain("not independent verification");
    expect(siteConfig.limitation.toLowerCase()).toMatch(/ownership|authenticity|investment safety/);
  });

  it("lists the five implemented ruleset checks", () => {
    expect(reviewSurfaces.map((surface) => surface.id)).toEqual([
      "R01",
      "R02",
      "R03",
      "R04",
      "R05",
    ]);
    const text = reviewSurfaces.map((surface) => surface.description).join(" ");
    expect(text.toLowerCase()).not.toMatch(
      /fraud-proof|trustless|guaranteed safe|verified ownership/,
    );
  });
});
