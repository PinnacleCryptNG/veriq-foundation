import { z } from "zod";
import { currencySchema, opportunityInstrumentSchema } from "@/types/primitives";

export const RULESET_VERSION = "2026.09.1";

export const ruleIdSchema = z.enum(["R01", "R02", "R03", "R04", "R05"]);

export const verificationStateSchema = z.enum([
  "consistent",
  "attention",
  "insufficient_evidence",
  "not_assessed",
]);

export const findingCategorySchema = z.enum([
  "security_representation",
  "transferability",
  "valuation_reference",
  "transaction_arithmetic",
  "evidence_completeness",
]);

export const securityInterestSchema = z.enum([
  "common_stock",
  "preferred_stock",
  "safe",
  "employee_tender",
  "spv_interest",
]);

export const transferRestrictionSchema = z.enum([
  "issuer_approval_required",
  "restricted",
  "no_restriction_stated",
]);

export const valuationUnitSchema = z.enum(["per_share", "total"]);

export const valuationReferenceTypeSchema = z.enum([
  "asking_price",
  "indicative_valuation",
  "appraisal",
  "completed_transaction",
]);

export const transferDetailsSchema = z.object({
  restriction: transferRestrictionSchema,
});

export const valuationDetailsSchema = z.object({
  amount: z.string().min(1),
  currency: currencySchema,
  unit: valuationUnitSchema,
  referenceType: valuationReferenceTypeSchema,
  referenceDate: z.string().min(1).optional(),
  basis: z.string().min(1).optional(),
});

export const transactionDetailsSchema = z.object({
  quantity: z.string().min(1),
  unitPrice: z.string().min(1),
  currency: currencySchema,
  fees: z.string().min(1).optional(),
  statedTotal: z.string().min(1).optional(),
});

export const structuredEvidenceDetailsSchema = z.object({
  securityType: securityInterestSchema.optional(),
  transfer: transferDetailsSchema.optional(),
  valuation: valuationDetailsSchema.optional(),
  transaction: transactionDetailsSchema.optional(),
});

export const engineOpportunitySchema = z.object({
  id: z.string().min(1),
  instrument: opportunityInstrumentSchema,
  quantityOffered: z.string().min(1).optional(),
  quotedPrice: z.string().min(1).optional(),
  currency: currencySchema.optional(),
});

export const engineEvidenceSchema = z.object({
  id: z.string().min(1),
  details: structuredEvidenceDetailsSchema,
});

export const engineInputSchema = z.object({
  opportunity: engineOpportunitySchema,
  evidence: z.array(engineEvidenceSchema),
});

export const findingSchema = z.object({
  id: z.string().min(1),
  ruleId: ruleIdSchema,
  category: findingCategorySchema,
  title: z.string().min(1),
  state: verificationStateSchema,
  explanation: z.string().min(1),
  comparedFields: z.array(z.string()),
  evidenceIds: z.array(z.string()),
  missingInformation: z.array(z.string()),
  limitation: z.string().min(1),
});

export const verificationSummarySchema = z.object({
  consistent: z.number().int().nonnegative(),
  attention: z.number().int().nonnegative(),
  insufficient_evidence: z.number().int().nonnegative(),
  not_assessed: z.number().int().nonnegative(),
});

export const verificationEvaluationSchema = z.object({
  rulesetVersion: z.literal(RULESET_VERSION),
  findings: z.array(findingSchema),
  summary: verificationSummarySchema,
});

export const verificationRunSchema = verificationEvaluationSchema.extend({
  id: z.string().min(1),
  opportunityId: z.string().min(1),
  timestamp: z.iso.datetime(),
});

export const storedVerificationStateSchema = z.object({
  version: z.literal(1),
  runs: z.array(z.unknown()),
});

export type RuleId = z.infer<typeof ruleIdSchema>;
export type VerificationState = z.infer<typeof verificationStateSchema>;
export type FindingCategory = z.infer<typeof findingCategorySchema>;
export type SecurityInterest = z.infer<typeof securityInterestSchema>;
export type TransferRestriction = z.infer<typeof transferRestrictionSchema>;
export type ValuationUnit = z.infer<typeof valuationUnitSchema>;
export type ValuationReferenceType = z.infer<typeof valuationReferenceTypeSchema>;
export type TransferDetails = z.infer<typeof transferDetailsSchema>;
export type ValuationDetails = z.infer<typeof valuationDetailsSchema>;
export type TransactionDetails = z.infer<typeof transactionDetailsSchema>;
export type StructuredEvidenceDetails = z.infer<
  typeof structuredEvidenceDetailsSchema
>;
export type EngineOpportunity = z.infer<typeof engineOpportunitySchema>;
export type EngineEvidence = z.infer<typeof engineEvidenceSchema>;
export type EngineInput = z.infer<typeof engineInputSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type VerificationSummary = z.infer<typeof verificationSummarySchema>;
export type VerificationEvaluation = z.infer<typeof verificationEvaluationSchema>;
export type VerificationRun = z.infer<typeof verificationRunSchema>;
