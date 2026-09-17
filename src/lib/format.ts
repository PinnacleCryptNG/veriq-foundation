import type {
  CurrencyCode,
  EvidenceType,
  Opportunity,
  OpportunityInstrument,
  OpportunityStatus,
} from "@/types/opportunity";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

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
