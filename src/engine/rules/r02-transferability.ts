import { createFinding, fieldPath, STANDARD_LIMITATION } from "@/engine/finding";
import type { EngineInput, Finding } from "@/types/verification";

export function evaluateTransferability(input: EngineInput): Finding {
  const records = input.evidence.filter(
    (item) => item.details.transfer !== undefined,
  );

  if (records.length === 0) {
    return createFinding("R02", "transferability", {
      title: "No structured transfer terms in evidence",
      state: "insufficient_evidence",
      explanation:
        "No evidence record contains explicitly entered transfer terms. The engine does not infer transferability from filenames, descriptions, or uploaded files.",
      comparedFields: [],
      evidenceIds: [],
      missingInformation: [
        "Structured transfer terms on at least one evidence record",
      ],
      limitation: `${STANDARD_LIMITATION} Missing transfer terms are not proof of wrongdoing.`,
    });
  }

  const evidenceIds = records.map((item) => item.id);
  const comparedFields = records.map((item) =>
    fieldPath(item.id, "transfer.restriction"),
  );
  const restricted = records.filter(
    (item) =>
      item.details.transfer?.restriction === "issuer_approval_required" ||
      item.details.transfer?.restriction === "restricted",
  );

  if (restricted.length > 0) {
    const details = restricted
      .map((item) => `${item.details.transfer?.restriction} on ${item.id}`)
      .join("; ");
    return createFinding("R02", "transferability", {
      title: "Structured transfer terms report a restriction",
      state: "attention",
      explanation: `Entered transfer terms report a restriction or issuer-approval requirement (${details}). This is a statement in submitted structured evidence, not an issuer confirmation and not a determination that a transfer is void or valid.`,
      comparedFields,
      evidenceIds,
      missingInformation: [],
    });
  }

  return createFinding("R02", "transferability", {
    title: "Structured evidence states no transfer restriction",
    state: "not_assessed",
    explanation:
      "Entered transfer terms state that no restriction was recorded. That is a statement in submitted evidence only. It is not independently confirmed and does not establish that the interest is freely transferable.",
    comparedFields,
    evidenceIds,
    missingInformation: [],
    limitation: `${STANDARD_LIMITATION} A “no restriction” statement is not issuer approval or a legal conclusion.`,
  });
}
