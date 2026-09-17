import { z } from "zod";
import { currencySchema, opportunityInstrumentSchema } from "@/types/primitives";
import { structuredEvidenceDetailsSchema } from "@/types/verification";

export { currencySchema, opportunityInstrumentSchema } from "@/types/primitives";
export type { CurrencyCode, OpportunityInstrument } from "@/types/primitives";

export const opportunityStatusSchema = z.enum([
  "intake_incomplete",
  "evidence_pending",
  "queued_for_review",
]);

export const evidenceTypeSchema = z.enum([
  "ownership_document",
  "transaction_agreement",
  "valuation_reference",
  "transfer_terms",
  "other",
]);

export const evidenceFileSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().int().nonnegative(),
  mimeType: z.string().min(1),
  bytesPersisted: z.boolean(),
  dataUrl: z.string().optional(),
});

export const evidenceSchema = z.object({
  id: z.string().min(1),
  type: evidenceTypeSchema,
  displayName: z.string().min(1),
  description: z.string().min(1).optional(),
  file: evidenceFileSchema.optional(),
  storageNote: z.string().min(1).optional(),
  structuredDetails: structuredEvidenceDetailsSchema.optional(),
  createdAt: z.iso.datetime(),
});

export const opportunitySchema = z.object({
  id: z.string().min(1),
  companyName: z.string().min(1),
  instrument: opportunityInstrumentSchema,
  shareClass: z.string().min(1).optional(),
  sellerOrIntermediary: z.string().min(1),
  quantityOffered: z.string().min(1).optional(),
  quotedPrice: z.string().min(1).optional(),
  currency: currencySchema.optional(),
  claimedSummary: z.string().min(1),
  source: z.string().min(1),
  status: opportunityStatusSchema,
  missingMaterials: z.array(z.string()),
  limitationNote: z.string().min(1),
  evidence: z.array(evidenceSchema),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  isDemo: z.boolean(),
});

export const opportunityIntakeSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Enter the issuer or company name."),
  instrument: z
    .string()
    .min(1, "Select a security or interest type.")
    .pipe(opportunityInstrumentSchema),
  shareClass: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional(),
  sellerOrIntermediary: z
    .string()
    .trim()
    .min(1, "Enter the seller or intermediary name."),
  quantityOffered: z
    .string()
    .trim()
    .min(1, "Enter the quantity offered.")
    .refine(
      (value) => Number(value.replace(/,/g, "")) > 0,
      "Enter a quantity greater than 0.",
    ),
  quotedPrice: z
    .string()
    .trim()
    .min(1, "Enter the quoted price.")
    .refine(
      (value) => Number(value.replace(/,/g, "")) > 0,
      "Enter a quoted price greater than 0.",
    ),
  currency: currencySchema,
  claimedSummary: z
    .string()
    .trim()
    .min(20, "Describe the claimed deal in at least 20 characters.")
    .max(500, "Keep the description to 500 characters or fewer."),
});

export const evidenceIntakeSchema = z.object({
  type: evidenceTypeSchema,
  displayName: z.string().trim().min(1, "Enter a display name for this record."),
  description: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? undefined : value))
    .optional(),
});

export const storedStateSchema = z.object({
  version: z.literal(1),
  opportunities: z.array(z.unknown()),
});

export type OpportunityStatus = z.infer<typeof opportunityStatusSchema>;
export type EvidenceType = z.infer<typeof evidenceTypeSchema>;
export type EvidenceFile = z.infer<typeof evidenceFileSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;
export type OpportunityIntake = z.infer<typeof opportunityIntakeSchema>;
export type EvidenceIntake = z.infer<typeof evidenceIntakeSchema>;
export type StoredState = z.infer<typeof storedStateSchema>;
