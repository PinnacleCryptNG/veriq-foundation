import { createFinding, fieldPath, STANDARD_LIMITATION } from "@/engine/finding";
import {
  ARITHMETIC_POLICY,
  exceedsTolerance,
  formatMoneyMinor,
  multiplyQuantityByUnitPrice,
  parseMoney,
  parseQuantity,
} from "@/engine/money";
import type { EngineEvidence, EngineInput, Finding } from "@/types/verification";

function evaluateRecord(item: EngineEvidence) {
  const transaction = item.details.transaction;
  if (!transaction) {
    return { status: "missing" as const };
  }
  if (!transaction.statedTotal) {
    return {
      status: "incomplete" as const,
      reason: "stated payment amount is missing",
    };
  }
  const quantity = parseQuantity(transaction.quantity);
  const unitPrice = parseMoney(transaction.unitPrice);
  const stated = parseMoney(transaction.statedTotal);
  const fees = transaction.fees
    ? parseMoney(transaction.fees)
    : { ok: true as const, minor: BigInt(0) };

  if (!quantity.ok) {
    return { status: "incomplete" as const, reason: quantity.reason };
  }
  if (!unitPrice.ok) {
    return { status: "incomplete" as const, reason: unitPrice.reason };
  }
  if (!stated.ok) {
    return { status: "incomplete" as const, reason: stated.reason };
  }
  if (!fees.ok) {
    return { status: "incomplete" as const, reason: fees.reason };
  }

  const product = multiplyQuantityByUnitPrice(quantity.minor, unitPrice.minor);
  const expected = product + fees.minor;
  return {
    status: "complete" as const,
    expected,
    stated: stated.minor,
    currency: transaction.currency,
    mismatch: exceedsTolerance(expected, stated.minor),
  };
}

export function evaluateTransactionArithmetic(input: EngineInput): Finding {
  const records = input.evidence.filter(
    (item) => item.details.transaction !== undefined,
  );

  if (records.length === 0) {
    return createFinding("R04", "transaction_arithmetic", {
      title: "No structured transaction amounts in evidence",
      state: "insufficient_evidence",
      explanation:
        "No evidence record contains explicitly entered quantity, unit price, currency, and stated payment amount. The engine does not infer that payment or settlement occurred, and it does not read uploaded files.",
      comparedFields: [],
      evidenceIds: [],
      missingInformation: [
        "Structured transaction quantity, unit price, currency, and stated payment amount",
      ],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY} Arithmetic on entered figures does not mean funds moved.`,
    });
  }

  const complete = [];
  const incompleteReasons: string[] = [];
  for (const item of records) {
    const result = evaluateRecord(item);
    if (result.status === "complete") {
      complete.push({ item, result });
    } else if (result.status === "incomplete") {
      incompleteReasons.push(`${item.id}: ${result.reason}`);
    }
  }

  if (complete.length === 0) {
    return createFinding("R04", "transaction_arithmetic", {
      title: "Transaction fields are incomplete or incompatible",
      state: "insufficient_evidence",
      explanation: `Structured transaction details were started, but required amounts are missing or not usable (${incompleteReasons.join("; ") || "quantity, unit price, currency, or stated total"}). No payment conclusion is drawn.`,
      comparedFields: records.map((item) => fieldPath(item.id, "transaction")),
      evidenceIds: records.map((item) => item.id),
      missingInformation: [
        "Quantity, unit price, currency, and stated payment amount in compatible units",
      ],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
    });
  }

  const mismatches = complete.filter(({ result }) => result.mismatch);
  const evidenceIds = complete.map(({ item }) => item.id);
  const comparedFields = complete.flatMap(({ item }) => [
    fieldPath(item.id, "transaction.quantity"),
    fieldPath(item.id, "transaction.unitPrice"),
    fieldPath(item.id, "transaction.fees"),
    fieldPath(item.id, "transaction.statedTotal"),
  ]);

  if (mismatches.length > 0) {
    const details = mismatches
      .map(
        ({ item, result }) =>
          `${item.id}: expected ${result.currency} ${formatMoneyMinor(result.expected)} vs stated ${result.currency} ${formatMoneyMinor(result.stated)}`,
      )
      .join("; ");
    return createFinding("R04", "transaction_arithmetic", {
      title: "Stated payment differs from quantity × price (+ fees)",
      state: "attention",
      explanation: `Entered quantity × unit price, plus fees where provided, differs from the stated payment amount beyond 1 cent (${details}). This is an arithmetic discrepancy in submitted figures. It does not establish that payment or settlement occurred or failed.`,
      comparedFields,
      evidenceIds,
      missingInformation: [],
      limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
    });
  }

  return createFinding("R04", "transaction_arithmetic", {
    title: "Stated payment matches quantity × price (+ fees)",
    state: "consistent",
    explanation:
      "Entered quantity × unit price, plus fees where provided, matches the stated payment amount within 1 cent. Matching arithmetic does not mean funds were paid, cleared, or received.",
    comparedFields,
    evidenceIds,
    missingInformation: [],
    limitation: `${STANDARD_LIMITATION} ${ARITHMETIC_POLICY}`,
  });
}
