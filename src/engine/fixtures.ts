import type { EngineInput, RuleId, VerificationState } from "@/types/verification";

export type EngineFixture = {
  id: string;
  label: string;
  note: string;
  input: EngineInput;
  expectedStates: Record<RuleId, VerificationState>;
  expectedEvidenceIds: Partial<Record<RuleId, string[]>>;
};

const baseOpportunity = {
  id: "opp_fix_base",
  instrument: "common_stock" as const,
  quantityOffered: "100",
  quotedPrice: "2.50",
  currency: "USD" as const,
};

export const verificationFixtures: EngineFixture[] = [
  {
    id: "matching_security_type",
    label: "Matching security type",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_match_security" },
      evidence: [
        {
          id: "evd_fix_match_security",
          details: { securityType: "common_stock" },
        },
      ],
    },
    expectedStates: {
      R01: "consistent",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R01: ["evd_fix_match_security"],
    },
  },
  {
    id: "direct_shares_vs_spv",
    label: "Direct-shares claim conflicting with SPV evidence",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_spv_conflict" },
      evidence: [
        {
          id: "evd_fix_spv",
          details: { securityType: "spv_interest" },
        },
      ],
    },
    expectedStates: {
      R01: "attention",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R01: ["evd_fix_spv"],
    },
  },
  {
    id: "transfer_approval_required",
    label: "Explicit transfer approval requirement",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_transfer_approval" },
      evidence: [
        {
          id: "evd_fix_transfer_approval",
          details: {
            transfer: { restriction: "issuer_approval_required" },
          },
        },
      ],
    },
    expectedStates: {
      R01: "insufficient_evidence",
      R02: "attention",
      R03: "insufficient_evidence",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R02: ["evd_fix_transfer_approval"],
    },
  },
  {
    id: "missing_transfer_terms",
    label: "Missing transfer terms",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_missing_transfer" },
      evidence: [
        {
          id: "evd_fix_no_transfer",
          details: { securityType: "common_stock" },
        },
      ],
    },
    expectedStates: {
      R01: "consistent",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R02: [],
    },
  },
  {
    id: "compatible_valuation",
    label: "Compatible valuation reference",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_valuation_match" },
      evidence: [
        {
          id: "evd_fix_valuation_match",
          details: {
            valuation: {
              amount: "2.50",
              currency: "USD",
              unit: "per_share",
              referenceType: "asking_price",
              referenceDate: "2026-08-01",
              basis: "Entered asking-price reference",
            },
          },
        },
      ],
    },
    expectedStates: {
      R01: "insufficient_evidence",
      R02: "insufficient_evidence",
      R03: "consistent",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R03: ["evd_fix_valuation_match"],
    },
  },
  {
    id: "incomparable_valuation",
    label: "Missing or incomparable valuation data",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_valuation_gap" },
      evidence: [
        {
          id: "evd_fix_valuation_gbp",
          details: {
            valuation: {
              amount: "2.50",
              currency: "GBP",
              unit: "per_share",
              referenceType: "appraisal",
            },
          },
        },
      ],
    },
    expectedStates: {
      R01: "insufficient_evidence",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R03: ["evd_fix_valuation_gbp"],
    },
  },
  {
    id: "matching_arithmetic",
    label: "Matching transaction arithmetic",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_arith_match" },
      evidence: [
        {
          id: "evd_fix_arith_match",
          details: {
            transaction: {
              quantity: "100",
              unitPrice: "2.50",
              currency: "USD",
              fees: "10.00",
              statedTotal: "260.00",
            },
          },
        },
      ],
    },
    expectedStates: {
      R01: "insufficient_evidence",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "consistent",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R04: ["evd_fix_arith_match"],
    },
  },
  {
    id: "arithmetic_mismatch",
    label: "Transaction arithmetic mismatch",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_arith_mismatch" },
      evidence: [
        {
          id: "evd_fix_arith_mismatch",
          details: {
            transaction: {
              quantity: "100",
              unitPrice: "2.50",
              currency: "USD",
              fees: "10.00",
              statedTotal: "250.00",
            },
          },
        },
      ],
    },
    expectedStates: {
      R01: "insufficient_evidence",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "attention",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R04: ["evd_fix_arith_mismatch"],
    },
  },
  {
    id: "missing_transaction_fields",
    label: "Missing transaction fields",
    note: "Test fixture. Not real company evidence.",
    input: {
      opportunity: { ...baseOpportunity, id: "opp_fix_arith_missing" },
      evidence: [
        {
          id: "evd_fix_arith_missing",
          details: {
            transaction: {
              quantity: "100",
              unitPrice: "2.50",
              currency: "USD",
            },
          },
        },
      ],
    },
    expectedStates: {
      R01: "insufficient_evidence",
      R02: "insufficient_evidence",
      R03: "insufficient_evidence",
      R04: "insufficient_evidence",
      R05: "insufficient_evidence",
    },
    expectedEvidenceIds: {
      R04: ["evd_fix_arith_missing"],
    },
  },
];
