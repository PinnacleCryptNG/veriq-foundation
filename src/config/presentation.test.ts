import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { reviewSurfaces } from "@/config/review-surfaces";
import { siteConfig } from "@/config/site";
import { PRESTOCKS_PRODUCTS_URL } from "@/config/prestocks";

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

  it("labels the PreStocks products page with Official product list and the configured URL", () => {
    expect(PRESTOCKS_PRODUCTS_URL).toBe("https://prestocks.com/products");
    const source = readFileSync(
      "/workspace/src/components/prestocks/prestocks-notice.tsx",
      "utf8",
    );
    expect(source).toContain("href={PRESTOCKS_PRODUCTS_URL}");
    expect(source).toMatch(
      /<a[\s\S]*?>[\s\S]*Official product list[\s\S]*<\/a>/,
    );
    expect(source).toContain('rel="noopener noreferrer"');
    expect(source).not.toMatch(
      /<a[\s\S]*?>[\s\S]*prestocks\.com\/products[\s\S]*<\/a>/,
    );
  });
});
