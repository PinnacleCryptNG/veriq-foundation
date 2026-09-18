import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("Phase 1 homepage redesign verification", () => {
  it("contains required hero headline, core message, and CTAs in homepage components", () => {
    const heroCode = readFileSync(
      "/workspace/src/components/overview/homepage-hero.tsx",
      "utf8",
    );

    // Headline or Core message
    expect(heroCode).toContain("before you send money.");

    // Supporting sentence (normalize whitespace)
    expect(heroCode.replace(/\s+/g, " ")).toContain(
      "Spot the mismatches between what the seller told you and what the available evidence supports — before you send money.",
    );

    // Value proposition for buyers & platforms
    expect(heroCode.toLowerCase()).toContain("buyers");

    // Primary & secondary CTAs
    expect(heroCode).toContain('href="/opportunities/new"');
    expect(heroCode).toContain("Start a new deal check");
    expect(heroCode).toContain("Run the 2-minute demo now");
  });

  it("includes clear example story with realistic synthetic scenario", () => {
    const visualCode = readFileSync(
      "/workspace/src/components/overview/verification-flow-visual.tsx",
      "utf8",
    );

    expect(visualCode).toContain("What the seller said");
    expect(visualCode).toContain("What supplied information describes");
    expect(visualCode).toContain("What VERIQ spots");
    expect(visualCode).toContain("Security representation mismatch");
    expect(visualCode).toContain("How VERIQ protects you");
  });

  it("includes a simple 3-step How It Works section", () => {
    const howCode = readFileSync(
      "/workspace/src/components/overview/how-it-works-section.tsx",
      "utf8",
    );

    expect(howCode).toContain("1. Paste what the seller told you");
    expect(howCode).toContain("2. Attach or type the paperwork");
    expect(howCode).toContain("3. See the mismatches in plain English");
  });

  it("keeps PreStocks as secondary market context", () => {
    const prestocksCard = readFileSync(
      "/workspace/src/components/overview/prestocks-market-context-card.tsx",
      "utf8",
    );

    expect(prestocksCard).toContain("PreStocks catalog");
    expect(prestocksCard).toContain("Market reference — not submitted evidence");
    expect(prestocksCard).toContain('href="/prestocks"');
    expect(prestocksCard).toContain("Official product list");
  });
});
