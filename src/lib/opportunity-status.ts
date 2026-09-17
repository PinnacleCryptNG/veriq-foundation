import type { OpportunityStatus } from "@/types/opportunity";

export function deriveIntakeStatus(evidenceCount: number): OpportunityStatus {
  return evidenceCount > 0 ? "queued_for_review" : "evidence_pending";
}
