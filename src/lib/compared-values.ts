import {
  instrumentLabels,
  securityInterestLabels,
  transferRestrictionLabels,
  valuationReferenceTypeLabels,
  valuationUnitLabels,
} from "@/lib/format";
import type { EngineEvidence, EngineInput } from "@/types/verification";

export type ComparedValueRow = {
  path: string;
  label: string;
  value: string;
  evidenceId?: string;
};

const evidencePathPattern =
  /^evidence\[(.+)\]\.details(?:\.(.+))?$/;

function findEvidence(input: EngineInput, evidenceId: string): EngineEvidence | undefined {
  return input.evidence.find((item) => item.id === evidenceId);
}

function formatEvidenceValue(item: EngineEvidence, detailPath?: string): string {
  const details = item.details;
  if (!detailPath || detailPath === "") {
    const parts = [];
    if (details.securityType) {
      parts.push(`security ${securityInterestLabels[details.securityType]}`);
    }
    if (details.transfer) {
      parts.push(`transfer ${transferRestrictionLabels[details.transfer.restriction]}`);
    }
    if (details.valuation) {
      parts.push(
        `valuation ${details.valuation.currency} ${details.valuation.amount} ${valuationUnitLabels[details.valuation.unit]} (${valuationReferenceTypeLabels[details.valuation.referenceType]})`,
      );
    }
    if (details.transaction) {
      parts.push(
        `transaction qty ${details.transaction.quantity} @ ${details.transaction.currency} ${details.transaction.unitPrice}` +
          (details.transaction.statedTotal
            ? `, stated ${details.transaction.currency} ${details.transaction.statedTotal}`
            : ", stated payment not entered"),
      );
    }
    return parts.length > 0 ? parts.join("; ") : "No structured values entered";
  }

  if (detailPath === "securityType") {
    return details.securityType
      ? securityInterestLabels[details.securityType]
      : "Not entered";
  }
  if (detailPath === "transfer.restriction") {
    return details.transfer
      ? transferRestrictionLabels[details.transfer.restriction]
      : "Not entered";
  }
  if (detailPath === "valuation" || detailPath.startsWith("valuation.")) {
    const valuation = details.valuation;
    if (!valuation) {
      return "Not entered";
    }
    if (detailPath === "valuation.amount") {
      return `${valuation.currency} ${valuation.amount}`;
    }
    return `${valuation.currency} ${valuation.amount} ${valuationUnitLabels[valuation.unit]} · ${valuationReferenceTypeLabels[valuation.referenceType]}`;
  }
  if (detailPath === "transaction" || detailPath.startsWith("transaction.")) {
    const transaction = details.transaction;
    if (!transaction) {
      return "Not entered";
    }
    if (detailPath === "transaction.quantity") {
      return transaction.quantity;
    }
    if (detailPath === "transaction.unitPrice") {
      return `${transaction.currency} ${transaction.unitPrice}`;
    }
    if (detailPath === "transaction.fees") {
      return transaction.fees
        ? `${transaction.currency} ${transaction.fees}`
        : "Not entered";
    }
    if (detailPath === "transaction.statedTotal") {
      return transaction.statedTotal
        ? `${transaction.currency} ${transaction.statedTotal}`
        : "Not entered";
    }
    return `${transaction.quantity} × ${transaction.currency} ${transaction.unitPrice}` +
      (transaction.fees ? ` + fees ${transaction.currency} ${transaction.fees}` : "") +
      (transaction.statedTotal
        ? ` = stated ${transaction.currency} ${transaction.statedTotal}`
        : ", stated payment not entered");
  }
  return "Not entered";
}

function formatOpportunityValue(input: EngineInput, field: string): string {
  if (field === "instrument") {
    return instrumentLabels[input.opportunity.instrument];
  }
  if (field === "quotedPrice") {
    return input.opportunity.quotedPrice ?? "Not provided";
  }
  if (field === "currency") {
    return input.opportunity.currency ?? "Not provided";
  }
  if (field === "quantityOffered") {
    return input.opportunity.quantityOffered ?? "Not provided";
  }
  return "Opportunity claim";
}

export function resolveComparedValues(
  comparedFields: string[],
  input?: EngineInput,
): ComparedValueRow[] {
  if (comparedFields.length === 0) {
    return [
      {
        path: "none",
        label: "Compared values",
        value: "This finding did not compare field values.",
      },
    ];
  }

  return comparedFields.map((path) => {
    if (path.startsWith("opportunity claims only")) {
      return {
        path,
        label: "Opportunity claims only",
        value: "No evidence record was supplied for this finding.",
      };
    }

    if (path.startsWith("opportunity.")) {
      const field = path.slice("opportunity.".length);
      return {
        path,
        label: `Opportunity ${field}`,
        value: input ? formatOpportunityValue(input, field) : "Not snapshotted on this run",
      };
    }

    const match = path.match(evidencePathPattern);
    if (match) {
      const evidenceId = match[1];
      const detailPath = match[2];
      const item = input ? findEvidence(input, evidenceId) : undefined;
      return {
        path,
        label: detailPath
          ? `Evidence ${evidenceId} · ${detailPath}`
          : `Evidence ${evidenceId} structured values`,
        value: item
          ? formatEvidenceValue(item, detailPath)
          : input
            ? "Evidence ID is not in the snapshotted input"
            : "Not snapshotted on this run",
        evidenceId,
      };
    }

    return {
      path,
      label: path,
      value: input ? path : "Not snapshotted on this run",
    };
  });
}
