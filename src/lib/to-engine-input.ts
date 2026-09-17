import type { Opportunity } from "@/types/opportunity";
import type { EngineInput } from "@/types/verification";

export function toEngineInput(opportunity: Opportunity): EngineInput {
  return {
    opportunity: {
      id: opportunity.id,
      instrument: opportunity.instrument,
      quantityOffered: opportunity.quantityOffered,
      quotedPrice: opportunity.quotedPrice,
      currency: opportunity.currency,
    },
    evidence: opportunity.evidence.map((item) => ({
      id: item.id,
      details: item.structuredDetails ?? {},
    })),
  };
}
