import { describe, expect, it } from "vitest";
import { parseStoredMarketReferences } from "@/lib/storage/market-reference-repository";
import { STORAGE_KEY } from "@/config/storage";
import { MARKET_REFERENCE_STORAGE_KEY } from "@/config/prestocks";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

describe("PreStocks reference storage isolation", () => {
  it("does not treat malformed reference JSON as opportunity data", () => {
    const parsed = parseStoredMarketReferences("{not-json");
    expect(parsed.references).toEqual([]);
    expect(parsed.warning).toMatch(/unreadable/);
    expect(parsed.warning).toMatch(/Opportunity records were not changed/);
  });

  it("keeps a valid selection when another item is malformed", () => {
    const parsed = parseStoredMarketReferences(
      JSON.stringify({
        version: 1,
        references: [
          {
            opportunityId: "opp_user_cedar",
            symbol: "OPENAI",
            selectedAt: "2026-09-17T12:00:00.000Z",
          },
          { opportunityId: "broken" },
        ],
      }),
    );
    expect(parsed.references.map((item) => item.opportunityId)).toEqual([
      "opp_user_cedar",
    ]);
    expect(parsed.warning).toMatch(/skipped/);
  });

  it("uses a storage key distinct from opportunity records", () => {
    expect(MARKET_REFERENCE_STORAGE_KEY).toBe("veriq.prestocks-references.v1");
    expect(MARKET_REFERENCE_STORAGE_KEY).not.toBe(STORAGE_KEY);
  });
});

describe("client bundle credential boundary", () => {
  it("does not fetch the upstream PreStocks URL or env catalog override from client UI", () => {
    const files = walk("/workspace/src")
      .filter((file) =>
        /\/src\/(app|components|hooks)\//.test(file.replaceAll("\\", "/")),
      )
      .filter((file) => !file.includes("/src/app/api/"));
    expect(files.length).toBeGreaterThan(10);
    const forbidden = [
      "PRESTOCKS_API_URL",
      "prestocksCatalogUrl",
      "Authorization",
      "api_key",
      "apiKey",
      "https://prestocks.com/api/prestocks",
    ];
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const token of forbidden) {
        if (text.includes(token)) {
          offenders.push(`${file}: ${token}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("does not mention PreStocks in the deterministic engine", () => {
    const files = walk("/workspace/src/engine");
    for (const file of files) {
      const text = readFileSync(file, "utf8").toLowerCase();
      expect(text).not.toMatch(/prestocks|tokenprice|markprice/);
    }
  });
});
