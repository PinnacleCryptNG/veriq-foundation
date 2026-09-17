import type {
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
