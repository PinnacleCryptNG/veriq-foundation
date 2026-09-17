import { opportunitySchema, type Opportunity } from "@/types/opportunity";

const demoOpportunitiesInput: Opportunity[] = [
  {
    id: "opp_demo_helion",
    companyName: "Helion Grid Systems",
    instrument: "common_stock",
    shareClass: "Common",
    sellerOrIntermediary: "Not named in seed packet",
    quantityOffered: "12400",
    currency: "USD",
    claimedSummary:
      "Secondary sale of 12,400 common shares. Transfer agent statement and share ledger not yet on file.",
    source: "Forwarded broker packet",
    status: "evidence_pending",
    missingMaterials: [
      "Current cap table excerpt",
      "Transfer agent confirmation",
    ],
    limitationNote:
      "Materials on file have not been authenticated and do not show issuer consent to transfer.",
    evidence: [],
    createdAt: "2026-09-08T16:20:00.000Z",
    updatedAt: "2026-09-14T16:20:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_northwind",
    companyName: "Northwind Robotics",
    instrument: "employee_tender",
    shareClass: "Common",
    sellerOrIntermediary: "Employee holder, unnamed in seed",
    currency: "USD",
    claimedSummary:
      "Employee tender for vested common stock. Intake is missing seller identity documents.",
    source: "Internal referral",
    status: "intake_incomplete",
    missingMaterials: [
      "Seller identity packet",
      "Plan administrator notice",
    ],
    limitationNote:
      "An incomplete intake cannot be treated as a completed review of this tender.",
    evidence: [],
    createdAt: "2026-09-15T09:05:00.000Z",
    updatedAt: "2026-09-16T09:05:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_meridian",
    companyName: "Meridian Bio",
    instrument: "preferred_stock",
    shareClass: "Series D Preferred",
    sellerOrIntermediary: "Not named in seed packet",
    currency: "USD",
    claimedSummary:
      "Series D preferred from a stated pre-IPO round. Claimed documents are listed and waiting in the review queue.",
    source: "Direct upload",
    status: "queued_for_review",
    missingMaterials: ["Board consent excerpt"],
    limitationNote:
      "Queued status means review has not started. Documents on file are not findings.",
    evidence: [],
    createdAt: "2026-09-10T21:40:00.000Z",
    updatedAt: "2026-09-12T21:40:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_atlas",
    companyName: "Atlas Quantum Compute",
    instrument: "safe",
    sellerOrIntermediary: "Not named in seed packet",
    currency: "USD",
    claimedSummary:
      "Claimed SAFE assignment from a 2024 financing. Assignment chain and company acknowledgment are absent.",
    source: "Introduced by counsel",
    status: "evidence_pending",
    missingMaterials: [
      "Executed assignment",
      "Company acknowledgment",
    ],
    limitationNote:
      "A SAFE copy alone does not establish a valid assignment or any right to purchase.",
    evidence: [],
    createdAt: "2026-09-04T13:15:00.000Z",
    updatedAt: "2026-09-10T13:15:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_lumen",
    companyName: "Lumen Harbor Analytics",
    instrument: "common_stock",
    shareClass: "Common",
    sellerOrIntermediary: "Northglass Secondary Desk (synthetic)",
    quantityOffered: "400",
    quotedPrice: "18.00",
    currency: "USD",
    claimedSummary:
      "Synthetic demo packet. The opportunity claims 400 common shares at USD 18.00. Structured evidence includes an SPV-interest description, issuer-approval transfer terms, a matching asking-price reference, and a transaction worksheet missing the stated payment amount. Not a real company or transaction.",
    source: "Synthetic demo scenario",
    status: "queued_for_review",
    missingMaterials: [
      "Independent issuer confirmation of the claimed share class",
      "Stated payment amount on the transaction worksheet",
    ],
    limitationNote:
      "All Lumen Harbor records and structured values are synthetic demo data. They are not real issuer documents, ownership proof, or independent confirmation.",
    evidence: [
      {
        id: "evd_demo_lumen_spv",
        type: "ownership_document",
        displayName: "SPV interest memo (synthetic demo)",
        description:
          "Synthetic demo record. Structured value is SPV interest, which conflicts with the claimed common stock. File contents are not read.",
        storageNote:
          "Synthetic metadata only. This is not a real ownership document and is not proof of authenticity or title.",
        structuredDetails: {
          securityType: "spv_interest",
        },
        createdAt: "2026-09-16T14:00:00.000Z",
      },
      {
        id: "evd_demo_lumen_transfer",
        type: "transfer_terms",
        displayName: "Transfer restriction note (synthetic demo)",
        description:
          "Synthetic demo record. Structured transfer terms state that issuer approval is required.",
        storageNote:
          "Synthetic metadata only. Entered terms are not an issuer confirmation.",
        structuredDetails: {
          transfer: { restriction: "issuer_approval_required" },
        },
        createdAt: "2026-09-16T14:05:00.000Z",
      },
      {
        id: "evd_demo_lumen_valuation",
        type: "valuation_reference",
        displayName: "Asking-price worksheet (synthetic demo)",
        description:
          "Synthetic demo record. Asking-price reference of USD 18.00 per share, same currency and unit as the claimed quote.",
        storageNote:
          "Synthetic metadata only. This is not an appraisal or completed trade.",
        structuredDetails: {
          valuation: {
            amount: "18.00",
            currency: "USD",
            unit: "per_share",
            referenceType: "asking_price",
            referenceDate: "2026-08-15",
            basis: "Synthetic asking-price worksheet",
          },
        },
        createdAt: "2026-09-16T14:10:00.000Z",
      },
      {
        id: "evd_demo_lumen_tx",
        type: "transaction_agreement",
        displayName: "Transaction worksheet (synthetic demo)",
        description:
          "Synthetic demo record. Quantity 400 × USD 18.00 plus USD 25.00 fees. Stated payment amount is intentionally omitted so arithmetic cannot finish.",
        storageNote:
          "Synthetic metadata only. Entered figures do not mean payment occurred.",
        structuredDetails: {
          transaction: {
            quantity: "400",
            unitPrice: "18.00",
            currency: "USD",
            fees: "25.00",
          },
        },
        createdAt: "2026-09-16T14:15:00.000Z",
      },
    ],
    createdAt: "2026-09-16T13:40:00.000Z",
    updatedAt: "2026-09-17T10:00:00.000Z",
    isDemo: true,
  },
];

export const demoOpportunities: Opportunity[] =
  demoOpportunitiesInput.map((opportunity) =>
    opportunitySchema.parse(opportunity),
  );

export const demoOpportunityIds = new Set(
  demoOpportunities.map((opportunity) => opportunity.id),
);

export const demoOpportunityCount = demoOpportunities.length;

export const DEMO_SCENARIO_ID = "opp_demo_lumen";

export function isDemoScenario(opportunityId: string): boolean {
  return opportunityId === DEMO_SCENARIO_ID;
}
