import { createFinding, fieldPath, STANDARD_LIMITATION } from "@/engine/finding";
import type { EngineInput, Finding } from "@/types/verification";

export function evaluateSecurityRepresentation(input: EngineInput): Finding {
  const claimed = input.opportunity.instrument;
  const records = input.evidence.filter(
    (item) => item.details.securityType !== undefined,
  );

  if (records.length === 0) {
    return createFinding("R01", "security_representation", {
      title: "No structured security type in evidence",
      state: "insufficient_evidence",
      explanation:
        "The opportunity claims a security or interest type, but no evidence record contains an explicitly entered structured security type. Filenames, MIME types, and free-text descriptions are ignored. This check did not compare representations.",
      comparedFields: ["opportunity.instrument"],
      evidenceIds: [],
      missingInformation: [
        "Structured security/interest type on at least one evidence record",
      ],
      limitation: `${STANDARD_LIMITATION} Missing structured type is not proof of wrongdoing.`,
    });
  }

  const evidenceIds = records.map((item) => item.id);
  const comparedFields = [
    "opportunity.instrument",
    ...records.map((item) => fieldPath(item.id, "securityType")),
  ];
  const conflicts = records.filter(
    (item) => item.details.securityType !== claimed,
  );

  if (conflicts.length > 0) {
    const conflictSummary = conflicts
      .map((item) => `${item.details.securityType} on ${item.id}`)
      .join("; ");
    return createFinding("R01", "security_representation", {
      title: "Claimed security type conflicts with structured evidence",
      state: "attention",
      explanation: `The opportunity claims ${claimed}. Structured evidence records describe a different security or interest type (${conflictSummary}). This is a conflicting description. It does not prove fraud or determine legal ownership.`,
      comparedFields,
      evidenceIds,
      missingInformation: [],
    });
  }

  return createFinding("R01", "security_representation", {
    title: "Claimed security type matches structured evidence",
    state: "consistent",
    explanation: `The opportunity claims ${claimed}, and the structured security type entered on the cited evidence record(s) is the same. Matching labels are not proof of ownership, issuance, or authenticity.`,
    comparedFields,
    evidenceIds,
    missingInformation: [],
  });
}
