import type { EvidenceType } from "@/types/opportunity";
import type { RuleId } from "@/types/verification";

export type StructuredFieldGroupId =
  | "security"
  | "transfer"
  | "valuation"
  | "transaction";

export type StructuredFieldGroup = {
  id: StructuredFieldGroupId;
  ruleId: RuleId;
  title: string;
  required: string[];
  why: string;
  recommendedFor: EvidenceType[];
};

export const structuredFieldGroups: StructuredFieldGroup[] = [
  {
    id: "security",
    ruleId: "R01",
    title: "Security or interest type",
    required: ["Structured security / interest type"],
    why: "R01 compares the opportunity’s claimed instrument with the type entered from this record. Matching or conflicting labels are descriptions only. They do not prove ownership, issuance, or authenticity.",
    recommendedFor: ["ownership_document"],
  },
  {
    id: "transfer",
    ruleId: "R02",
    title: "Transfer terms",
    required: ["Transfer restriction or approval requirement"],
    why: "R02 reads the transfer terms you enter. An approval requirement or restriction is a statement in submitted evidence, not issuer confirmation and not a legal conclusion.",
    recommendedFor: ["transfer_terms"],
  },
  {
    id: "valuation",
    ruleId: "R03",
    title: "Valuation reference",
    required: [
      "Amount",
      "Currency",
      "Unit",
      "Reference type (asking price, indicative, appraisal, or completed transaction)",
    ],
    why: "R03 compares a quoted opportunity price only when currency, unit, and asking-price basis are compatible. A difference is a discrepancy between entered figures, not an overpriced or underpriced opinion.",
    recommendedFor: ["valuation_reference"],
  },
  {
    id: "transaction",
    ruleId: "R04",
    title: "Transaction arithmetic",
    required: ["Quantity", "Unit price", "Currency", "Stated payment amount"],
    why: "R04 checks quantity × unit price, plus fees if provided, against the stated payment. Matching arithmetic does not mean funds moved or settlement occurred.",
    recommendedFor: ["transaction_agreement"],
  },
];

export const evidenceEntryReminder =
  "Enter values that appear in the submitted evidence. Do not guess, and do not copy from the filename, MIME type, or description.";

export const valueSourceLegend = [
  {
    id: "user_entered",
    label: "User-entered structured values",
    detail: "Typed or selected in this form. These are the only values the review engine uses.",
  },
  {
    id: "file_metadata",
    label: "File metadata",
    detail: "Filename, size, and MIME type. Not document contents and not proof of authenticity.",
  },
  {
    id: "extracted",
    label: "Extracted values",
    detail: "Not available in this demo. VERIQ does not read or extract document contents.",
  },
  {
    id: "confirmed",
    label: "Independently confirmed",
    detail: "Not available in this demo. No issuer, cap-table, or third-party confirmation is performed.",
  },
] as const;
