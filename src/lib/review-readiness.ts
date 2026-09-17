import type { Evidence, Opportunity } from "@/types/opportunity";
import type { RuleId, StructuredEvidenceDetails } from "@/types/verification";

export type ReadinessStatus = "ready" | "needs_input";

export type CheckReadiness = {
  ruleId: RuleId;
  title: string;
  status: ReadinessStatus;
  summary: string;
  missing: string[];
  evidenceIds: string[];
};

export type ReviewReadiness = {
  checks: CheckReadiness[];
  readyCount: number;
  needsInputCount: number;
};

function idsWith(
  evidence: Evidence[],
  predicate: (details: StructuredEvidenceDetails) => boolean,
): string[] {
  return evidence
    .filter((item) => predicate(item.structuredDetails ?? {}))
    .map((item) => item.id);
}

function assessSecurity(opportunity: Opportunity): CheckReadiness {
  const evidenceIds = idsWith(
    opportunity.evidence,
    (details) => details.securityType !== undefined,
  );
  if (evidenceIds.length === 0) {
    return {
      ruleId: "R01",
      title: "Security representation",
      status: "needs_input",
      summary: "Needs a structured security or interest type on an evidence record.",
      missing: [
        "Structured security / interest type on at least one evidence record",
      ],
      evidenceIds: [],
    };
  }
  return {
    ruleId: "R01",
    title: "Security representation",
    status: "ready",
    summary: "A structured security type is entered and can be compared with the claimed instrument.",
    missing: [],
    evidenceIds,
  };
}

function assessTransfer(opportunity: Opportunity): CheckReadiness {
  const evidenceIds = idsWith(
    opportunity.evidence,
    (details) => details.transfer !== undefined,
  );
  if (evidenceIds.length === 0) {
    return {
      ruleId: "R02",
      title: "Transferability",
      status: "needs_input",
      summary: "Needs structured transfer terms on an evidence record.",
      missing: ["Structured transfer terms on at least one evidence record"],
      evidenceIds: [],
    };
  }
  return {
    ruleId: "R02",
    title: "Transferability",
    status: "ready",
    summary: "Structured transfer terms are entered and can be reviewed.",
    missing: [],
    evidenceIds,
  };
}

function assessValuation(opportunity: Opportunity): CheckReadiness {
  const evidenceIds = idsWith(
    opportunity.evidence,
    (details) => details.valuation !== undefined,
  );
  const missing: string[] = [];
  if (evidenceIds.length === 0) {
    missing.push(
      "Structured valuation amount, currency, unit, and reference type",
    );
  }
  if (!opportunity.quotedPrice || !opportunity.currency) {
    missing.push("Opportunity quoted price and currency");
  }
  if (missing.length > 0) {
    return {
      ruleId: "R03",
      title: "Valuation reference",
      status: "needs_input",
      summary: "Needs comparable valuation details and a quoted opportunity price.",
      missing,
      evidenceIds,
    };
  }
  return {
    ruleId: "R03",
    title: "Valuation reference",
    status: "ready",
    summary:
      "Valuation details and a quoted price are present. The engine still skips incomparable currencies, units, or bases.",
    missing: [],
    evidenceIds,
  };
}

function assessTransaction(opportunity: Opportunity): CheckReadiness {
  const startedIds = idsWith(
    opportunity.evidence,
    (details) => details.transaction !== undefined,
  );
  const completeIds = idsWith(opportunity.evidence, (details) => {
    const transaction = details.transaction;
    return Boolean(
      transaction?.quantity &&
        transaction.unitPrice &&
        transaction.currency &&
        transaction.statedTotal,
    );
  });
  if (completeIds.length === 0) {
    return {
      ruleId: "R04",
      title: "Transaction arithmetic",
      status: "needs_input",
      summary:
        startedIds.length > 0
          ? "Transaction figures were started, but quantity, unit price, currency, and stated payment are all required."
          : "Needs structured transaction quantity, unit price, currency, and stated payment amount.",
      missing: [
        "Quantity, unit price, currency, and stated payment amount on an evidence record",
      ],
      evidenceIds: startedIds,
    };
  }
  return {
    ruleId: "R04",
    title: "Transaction arithmetic",
    status: "ready",
    summary: "Quantity, unit price, currency, and stated payment are entered and can be checked.",
    missing: [],
    evidenceIds: completeIds,
  };
}

function assessCompleteness(checks: CheckReadiness[]): CheckReadiness {
  const missing = checks.flatMap((check) =>
    check.missing.map((item) => `${check.ruleId}: ${item}`),
  );
  const evidenceIds = [...new Set(checks.flatMap((check) => check.evidenceIds))];
  if (missing.length > 0) {
    return {
      ruleId: "R05",
      title: "Evidence completeness",
      status: "needs_input",
      summary: "Some implemented checks still lack required structured values.",
      missing,
      evidenceIds,
    };
  }
  return {
    ruleId: "R05",
    title: "Evidence completeness",
    status: "ready",
    summary:
      "Each implemented check has the structured fields it needs. That is not authenticity, ownership, or a verification verdict.",
    missing: [],
    evidenceIds,
  };
}

export function assessReviewReadiness(opportunity: Opportunity): ReviewReadiness {
  const inputChecks = [
    assessSecurity(opportunity),
    assessTransfer(opportunity),
    assessValuation(opportunity),
    assessTransaction(opportunity),
  ];
  const checks = [...inputChecks, assessCompleteness(inputChecks)];
  return {
    checks,
    readyCount: checks.filter((check) => check.status === "ready").length,
    needsInputCount: checks.filter((check) => check.status === "needs_input")
      .length,
  };
}
