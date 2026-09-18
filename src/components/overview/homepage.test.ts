import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("Phase 1 homepage redesign verification", () => {
  it("contains required hero headline, supporting sentence, and CTAs in homepage components", () => {
    const heroCode = readFileSync(
      "/workspace/src/components/overview/homepage-hero.tsx",
      "utf8",
    );

    // Headline
    expect(heroCode).toContain("Verify the opportunity before you buy it.");

    // Supporting sentence (normalize whitespace)
    expect(heroCode.replace(/\s+/g, " ")).toContain(
      "See exactly what security, ownership, valuation, rights and transfer conditions are supported by evidence — before you send money.",
    );

    // Value proposition for buyers & platforms
    expect(heroCode.toLowerCase()).toContain("private-market buyers");
    expect(heroCode.toLowerCase()).toContain("intermediaries and review desks");

    // Primary & secondary CTAs
    expect(heroCode).toContain('href="/opportunities/new"');
    expect(heroCode).toContain("Start verification");
    expect(heroCode).toContain("Explore synthetic demo");
  });

  it("includes Claim -> Evidence -> Result visual with realistic synthetic scenario", () => {
    const visualCode = readFileSync(
      "/workspace/src/components/overview/verification-flow-visual.tsx",
      "utf8",
    );

    expect(visualCode).toContain("Claimed deal terms");
    expect(visualCode).toContain("Entered evidence");
    expect(visualCode).toContain("Deterministic findings");
    expect(visualCode).toContain("R01 · Attention (Security Mismatch)");
    expect(visualCode).toContain("R04 · Insufficient Evidence");
    expect(visualCode).toContain("Objective finding boundary");
  });

  it("includes a simple 3-step How It Works section", () => {
    const howCode = readFileSync(
      "/workspace/src/components/overview/how-it-works-section.tsx",
      "utf8",
    );

    expect(howCode).toContain("Describe the opportunity");
    expect(howCode).toContain("Add available evidence");
    expect(howCode).toContain("Review findings & gaps");
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
