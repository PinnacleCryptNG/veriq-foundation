import { z } from "zod";

export const opportunityStatusSchema = z.enum([
  "intake_incomplete",
  "evidence_pending",
  "queued_for_review",
]);

export const opportunityInstrumentSchema = z.enum([
  "common_stock",
  "preferred_stock",
  "safe",
  "employee_tender",
]);

export const opportunitySchema = z.object({
  id: z.string(),
  companyName: z.string(),
  instrument: opportunityInstrumentSchema,
  claimedSummary: z.string(),
  source: z.string(),
  status: opportunityStatusSchema,
  materialsOnFile: z.number().int().nonnegative(),
  missingMaterials: z.array(z.string()),
  limitationNote: z.string(),
  updatedAt: z.iso.datetime(),
  isDemo: z.literal(true),
});

export type OpportunityStatus = z.infer<typeof opportunityStatusSchema>;
export type OpportunityInstrument = z.infer<typeof opportunityInstrumentSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;
