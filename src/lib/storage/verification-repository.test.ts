import { describe, expect, it } from "vitest";
import { RULESET_VERSION, type VerificationRun } from "@/types/verification";
import {
  parseStoredVerificationRuns,
  runsForOpportunity,
  saveVerificationRun,
} from "@/lib/storage/verification-repository";

function sampleRun(
  id: string,
  opportunityId: string,
  timestamp: string,
  title: string,
): VerificationRun {
  return {
    id,
    opportunityId,
    timestamp,
    rulesetVersion: RULESET_VERSION,
    inputSnapshot: {
      opportunity: { id: opportunityId, instrument: "common_stock" },
      evidence: [],
    },
    evidenceCatalog: [{ id: "evd_sample", displayName: "Sample record" }],
    findings: [
      {
        id: "finding-R01",
        ruleId: "R01",
        category: "security_representation",
        title,
        state: "insufficient_evidence",
        explanation: "No structured security type in evidence.",
        comparedFields: ["opportunity.instrument"],
        evidenceIds: [],
        missingInformation: ["Structured security type"],
        limitation: "Demo limitation.",
      },
    ],
    summary: {
      consistent: 0,
      attention: 0,
      insufficient_evidence: 1,
      not_assessed: 0,
    },
  };
}

describe("verification run repository", () => {
  it("ignores malformed review storage without inventing runs", () => {
    const parsed = parseStoredVerificationRuns("{not-json");
    expect(parsed.runs).toEqual([]);
    expect(parsed.warning).toMatch(/unreadable/);
  });

  it("recovers readable runs when the storage version is unexpected", () => {
    const payload = JSON.stringify({
      version: 99,
      runs: [
        {
          id: "run_old",
          opportunityId: "opp_old",
          timestamp: "2026-09-17T10:00:00.000Z",
          rulesetVersion: RULESET_VERSION,
          findings: [
            {
              id: "finding-R05",
              ruleId: "R05",
              category: "evidence_completeness",
              title: "Some checks could not run",
              state: "insufficient_evidence",
              explanation: "Missing structured values.",
              comparedFields: [],
              evidenceIds: [],
              missingInformation: ["Structured security type"],
              limitation: "Demo limitation.",
            },
          ],
          summary: {
            consistent: 0,
            attention: 0,
            insufficient_evidence: 1,
            not_assessed: 0,
          },
        },
      ],
    });
    const parsed = parseStoredVerificationRuns(payload);
    expect(parsed.runs).toHaveLength(1);
    expect(parsed.warning).toMatch(/unexpected storage version/);
  });

  it("accepts older runs that omit the snapshot fields", () => {
    const payload = JSON.stringify({
      version: 1,
      runs: [
        {
          id: "run_old",
          opportunityId: "opp_old",
          timestamp: "2026-09-17T10:00:00.000Z",
          rulesetVersion: RULESET_VERSION,
          findings: [
            {
              id: "finding-R05",
              ruleId: "R05",
              category: "evidence_completeness",
              title: "Some checks could not run",
              state: "insufficient_evidence",
              explanation: "Missing structured values.",
              comparedFields: [],
              evidenceIds: [],
              missingInformation: ["Structured security type"],
              limitation: "Demo limitation.",
            },
          ],
          summary: {
            consistent: 0,
            attention: 0,
            insufficient_evidence: 1,
            not_assessed: 0,
          },
        },
      ],
    });
    const parsed = parseStoredVerificationRuns(payload);
    expect(parsed.warning).toBeNull();
    expect(parsed.runs).toHaveLength(1);
    expect(parsed.runs[0]?.inputSnapshot).toBeUndefined();
  });

  it("appends a new run without mutating the previous run’s findings", () => {
    const first = sampleRun(
      "run_hist_1",
      "opp_hist",
      "2026-09-17T10:00:00.000Z",
      "First run title",
    );
    const second = sampleRun(
      "run_hist_2",
      "opp_hist",
      "2026-09-17T10:05:00.000Z",
      "Second run title",
    );

    saveVerificationRun(first);
    saveVerificationRun(second);

    const stored = runsForOpportunity(
      saveVerificationRun(second).runs,
      "opp_hist",
    );
    expect(stored).toHaveLength(2);
    expect(stored[0]?.id).toBe("run_hist_2");
    expect(stored[1]?.id).toBe("run_hist_1");
    expect(stored[1]?.findings[0]?.title).toBe("First run title");
    expect(stored[0]?.findings[0]?.title).toBe("Second run title");
    expect(stored[1]?.inputSnapshot).toEqual(first.inputSnapshot);
  });
});
