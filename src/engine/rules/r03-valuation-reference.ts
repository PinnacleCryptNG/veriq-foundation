import { createFinding, fieldPath, STANDARD_LIMITATION } from "@/engine/finding";
import {
  ARITHMETIC_POLICY,
  exceedsTolerance,
  formatMoneyMinor,
  parseMoney,
  parseQuantity,
  multiplyQuantityByUnitPrice,
} from "@/engine/money";
import type { EngineEvidence, EngineInput, Finding } from "@/types/verification";

function opportunityUnitPrice(input: EngineInput) {
  if (!input.opportunity.quotedPrice || !input.opportunity.currency) {
    return null;
  }
  const parsed = parseMoney(input.opportunity.quotedPrice);
  if (!parsed.ok) {
    return null;
  }
  return { minor: parsed.minor, currency: input.opportunity.currency };
}

function comparableValuation(input: EngineInput, item: EngineEvidence) {
  const valuation = item.details.valuation;
  const claimed = opportunityUnitPrice(input);
  if (!valuation || !claimed) {
    return { status: "missing" as const };
  }
  if (valuation.currency !== claimed.currency) {
    return { status: "incomparable" as const, reason: "currency mismatch" };
  }
  if (valuation.referenceType !== "asking_price") {
    return {
      status: "incomparable" as const,
      reason: `valuation basis is ${valuation.referenceType}, not asking_price`,
    };
  }
  const amount = parseMoney(valuation.amount);
  if (!amount.ok) {
    return { status: "incomparable" as const, reason: amount.reason };
  }

  if (valuation.unit === "per_share") {
    return {
      status: "comparable" as const,
      claimedMinor: claimed.minor,
      evidenceMinor: amount.minor,
      currency: claimed.currency,
    };
  }

  if (!input.opportunity.quantityOffered) {
    return {
      status: "incomparable" as const,
      reason: "total valuation cannot be compared without opportunity quantity",
    };
  }
  const quantity = parseQuantity(input.opportunity.quantityOffered);
  if (!quantity.ok) {
    return { status: "incomparable" as const, reason: quantity.reason };
  }
  const claimedTotal = multiplyQuantityByUnitPrice(quantity.minor, claimed.minor);
  return {
    status: "comparable" as const,
    claimedMinor: claimedTotal,
    evidenceMinor: amount.minor,
    currency: claimed.currency,
  };
}

export function evaluateValuationReference(input: EngineInput): Finding {
  const records = input.evidence.filter(
    (item) => item.details.valuation !== undefined,
  );

  if (records.length === 0) {
    return createFinding("R03", "valuation_reference", {
      title: "No structured valuation reference in evidence",
      state: "insufficient_evidence",
      explanation:
        "No evidence record contains an explicitly entered valuation amount, currency, unit, and reference type. The quoted opportunity price was not compared. Filenames and descriptions are not used as valuations.",
      comparedFields: ["opportunity.quotedPrice", "opportunity.currency"],
      evidenceIds: [],
      missingInformation: [
        "Structured valuation amount, currency, unit, and reference type",
      ],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
    });
  }

  if (!input.opportunity.quotedPrice || !input.opportunity.currency) {
    return createFinding("R03", "valuation_reference", {
      title: "Opportunity has no comparable quoted price",
      state: "insufficient_evidence",
      explanation:
        "Structured valuation details are present, but the opportunity has no quoted price and currency to compare. No over/under pricing conclusion is drawn.",
      comparedFields: [
        "opportunity.quotedPrice",
        "opportunity.currency",
        ...records.map((item) => fieldPath(item.id, "valuation")),
      ],
      evidenceIds: records.map((item) => item.id),
      missingInformation: ["Opportunity quoted price and currency"],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
    });
  }

  const comparable = [];
  const incomparableReasons: string[] = [];
  for (const item of records) {
    const result = comparableValuation(input, item);
    if (result.status === "comparable") {
      comparable.push({ item, result });
    } else if (result.status === "incomparable") {
      incomparableReasons.push(`${item.id}: ${result.reason}`);
    }
  }

  if (comparable.length === 0) {
    return createFinding("R03", "valuation_reference", {
      title: "Valuation data is present but not comparable",
      state: "insufficient_evidence",
      explanation: `Structured valuation values were entered, but none are comparable to the opportunity quoted price (${incomparableReasons.join("; ") || "incompatible currency, unit, or valuation basis"}). Asking price, indicative valuation, appraisal, and completed transaction are different bases and are not treated as interchangeable. No price opinion is formed.`,
      comparedFields: [
        "opportunity.quotedPrice",
        "opportunity.currency",
        "opportunity.quantityOffered",
        ...records.map((item) => fieldPath(item.id, "valuation")),
      ],
      evidenceIds: records.map((item) => item.id),
      missingInformation: [
        "Valuation with the same currency, a compatible unit, and an asking_price basis",
      ],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
    });
  }

  const mismatches = comparable.filter(({ result }) =>
    exceedsTolerance(result.claimedMinor, result.evidenceMinor),
  );
  const evidenceIds = comparable.map(({ item }) => item.id);
  const comparedFields = [
    "opportunity.quotedPrice",
    "opportunity.currency",
    ...comparable.map(({ item }) => fieldPath(item.id, "valuation.amount")),
  ];

  if (mismatches.length > 0) {
    const details = mismatches
      .map(
        ({ item, result }) =>
          `${item.id}: evidence ${result.currency} ${formatMoneyMinor(result.evidenceMinor)} vs claimed ${result.currency} ${formatMoneyMinor(result.claimedMinor)}`,
      )
      .join("; ");
    return createFinding("R03", "valuation_reference", {
      title: "Quoted price differs from structured valuation reference",
      state: "attention",
      explanation: `The opportunity quoted price and a comparable asking-price valuation reference differ beyond a 1-cent tolerance (${details}). This is a discrepancy between entered figures. It is not proof of misrepresentation, and it is not an overpriced or underpriced opinion.`,
      comparedFields,
      evidenceIds,
      missingInformation: [],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
    });
  }

  return createFinding("R03", "valuation_reference", {
    title: "Quoted price matches comparable valuation reference",
    state: "consistent",
    explanation:
      "The opportunity quoted price matches the comparable asking-price valuation amount within 1 cent, using the same currency and a compatible unit. Matching numbers are not an appraisal and do not confirm that a transaction occurred.",
    comparedFields,
    evidenceIds,
    missingInformation: [],
    limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
  });
}
