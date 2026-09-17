import type {
  CurrencyCode,
  EvidenceType,
  Opportunity,
  OpportunityInstrument,
  OpportunityStatus,
} from "@/types/opportunity";
import type {
  FindingCategory,
  SecurityInterest,
  TransferRestriction,
  ValuationReferenceType,
  ValuationUnit,
  VerificationState,
} from "@/types/verification";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function formatDateTime(iso: string): string {
  return `${dateTimeFormatter.format(new Date(iso))} UTC`;
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export const instrumentLabels: Record<OpportunityInstrument, string> = {
  common_stock: "Common stock",
  preferred_stock: "Preferred stock",
  safe: "SAFE",
  employee_tender: "Employee tender",
};

export const statusLabels: Record<OpportunityStatus, string> = {
  intake_incomplete: "Intake incomplete",
  evidence_pending: "Evidence pending",
  queued_for_review: "Queued for review",
};

export const statusDescriptions: Record<OpportunityStatus, string> = {
  intake_incomplete: "Required intake fields are still missing.",
  evidence_pending: "Claimed materials have not all been submitted.",
  queued_for_review: "Ready to enter review. Review has not started.",
};

export const currencyLabels: Record<CurrencyCode, string> = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
};

export const securityInterestLabels: Record<SecurityInterest, string> = {
  common_stock: "Common stock",
  preferred_stock: "Preferred stock",
  safe: "SAFE",
  employee_tender: "Employee tender",
  spv_interest: "SPV interest",
};

export const transferRestrictionLabels: Record<TransferRestriction, string> = {
  issuer_approval_required: "Issuer approval required",
  restricted: "Transfer restricted",
  no_restriction_stated: "No restriction stated",
};

export const valuationUnitLabels: Record<ValuationUnit, string> = {
  per_share: "Per share / unit",
  total: "Total",
};

export const valuationReferenceTypeLabels: Record<ValuationReferenceType, string> = {
  asking_price: "Asking price",
  indicative_valuation: "Indicative valuation",
  appraisal: "Appraisal",
  completed_transaction: "Completed transaction",
};

export const verificationStateLabels: Record<VerificationState, string> = {
  consistent: "Consistent",
  attention: "Attention",
  insufficient_evidence: "Insufficient evidence",
  not_assessed: "Not assessed",
};

export const verificationStateHelp: Record<VerificationState, string> = {
  consistent:
    "This specific comparison of entered values matched. It is not a legitimacy, safety, ownership, or investment conclusion.",
  attention:
    "A mismatch or reported restriction was found in entered values. That is a condition to review, not proof of fraud or wrongdoing.",
  insufficient_evidence:
    "Required structured inputs were missing, so this check could not compare the values it needs.",
  not_assessed:
    "This check did not confirm the claim. It is not a successful result.",
};

export const findingCategoryLabels: Record<FindingCategory, string> = {
  security_representation: "Security representation",
  transferability: "Transferability",
  valuation_reference: "Valuation reference",
  transaction_arithmetic: "Transaction arithmetic",
  evidence_completeness: "Evidence completeness",
};

export const evidenceTypeLabels: Record<EvidenceType, string> = {
  ownership_document: "Ownership document",
  transaction_agreement: "Transaction agreement",
  valuation_reference: "Valuation reference",
  transfer_terms: "Transfer terms",
  other: "Other",
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatClaimedPrice(opportunity: Opportunity): string {
  if (!opportunity.quotedPrice) {
    return "Not provided";
  }

  return opportunity.currency
    ? `${opportunity.currency} ${opportunity.quotedPrice}`
    : opportunity.quotedPrice;
}

export function formatQuantity(opportunity: Opportunity): string {
  return opportunity.quantityOffered ?? "Not provided";
}
