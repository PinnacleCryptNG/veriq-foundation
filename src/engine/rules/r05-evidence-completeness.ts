import { createFinding, STANDARD_LIMITATION } from "@/engine/finding";
import type { EngineInput, Finding } from "@/types/verification";

export function evaluateEvidenceCompleteness(input: EngineInput): Finding {
  const missing: string[] = [];
  const usedIds = input.evidence.map((item) => item.id);

  const hasSecurityType = input.evidence.some(
    (item) => item.details.securityType !== undefined,
  );
  if (!hasSecurityType) {
    missing.push(
      "R01 Security representation: structured security/interest type on an evidence record",
    );
  }

  const hasTransfer = input.evidence.some(
    (item) => item.details.transfer !== undefined,
  );
  if (!hasTransfer) {
    missing.push("R02 Transferability: structured transfer terms");
  }

  const hasValuation = input.evidence.some(
    (item) => item.details.valuation !== undefined,
  );
  if (!hasValuation) {
    missing.push(
      "R03 Valuation reference: structured amount, currency, unit, and reference type",
    );
  } else if (!input.opportunity.quotedPrice || !input.opportunity.currency) {
    missing.push(
      "R03 Valuation reference: opportunity quoted price and currency",
    );
  }

  const hasCompleteTransaction = input.evidence.some((item) => {
    const transaction = item.details.transaction;
    return Boolean(
      transaction?.quantity &&
        transaction.unitPrice &&
        transaction.currency &&
        transaction.statedTotal,
    );
  });
  if (!hasCompleteTransaction) {
    missing.push(
      "R04 Transaction arithmetic: quantity, unit price, currency, and stated payment amount",
    );
  }

  if (missing.length > 0) {
    return createFinding("R05", "evidence_completeness", {
      title: "Some checks could not run with the structured values supplied",
      state: "insufficient_evidence",
      explanation: `The following checks lacked required evidence or structured values: ${missing.join("; ")}. Enter the named fields explicitly. The engine does not extract them from files. Missing information is not proof of wrongdoing.`,
      comparedFields:
        usedIds.length === 0
          ? ["opportunity claims only; no evidence records were supplied"]
          : usedIds.map((id) => `evidence[${id}].details`),
      evidenceIds: usedIds,
      missingInformation: missing,
      limitation: `${STANDARD_LIMITATION} Completeness describes whether structured fields were entered, not whether documents are authentic.`,
    });
  }

  return createFinding("R05", "evidence_completeness", {
    title: "Required structured fields for implemented checks are present",
    state: "consistent",
    explanation:
      "Each implemented check had the structured values it needs. That does not mean documents were read, authenticated, or confirmed by an issuer, and it does not mean the opportunity is complete, valid, or safe.",
    comparedFields: usedIds.map((id) => `evidence[${id}].details`),
    evidenceIds: usedIds,
    missingInformation: [],
    limitation: `${STANDARD_LIMITATION} Completeness of entered fields is not authenticity, ownership, or investment safety.`,
  });
}
