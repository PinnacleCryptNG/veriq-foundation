import { opportunitySchema, type Opportunity } from "@/types/opportunity";

const demoOpportunitiesInput: Opportunity[] = [
  {
    id: "opp_demo_helion",
    companyName: "Helion Grid Systems",
    instrument: "common_stock",
    claimedSummary:
      "Secondary sale of 12,400 common shares. Transfer agent statement and share ledger not yet on file.",
    source: "Forwarded broker packet",
    status: "evidence_pending",
    materialsOnFile: 2,
    missingMaterials: [
      "Current cap table excerpt",
      "Transfer agent confirmation",
    ],
    limitationNote:
      "Materials on file have not been authenticated and do not show issuer consent to transfer.",
    updatedAt: "2026-09-14T16:20:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_northwind",
    companyName: "Northwind Robotics",
    instrument: "employee_tender",
    claimedSummary:
      "Employee tender for vested common stock. Intake is missing seller identity documents.",
    source: "Internal referral",
    status: "intake_incomplete",
    materialsOnFile: 1,
    missingMaterials: [
      "Seller identity packet",
      "Plan administrator notice",
    ],
    limitationNote:
      "An incomplete intake cannot be treated as a completed review of this tender.",
    updatedAt: "2026-09-16T09:05:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_meridian",
    companyName: "Meridian Bio",
    instrument: "preferred_stock",
    claimedSummary:
      "Series D preferred from a stated pre-IPO round. Claimed documents are listed and waiting in the review queue.",
    source: "Direct upload",
    status: "queued_for_review",
    materialsOnFile: 4,
    missingMaterials: ["Board consent excerpt"],
    limitationNote:
      "Queued status means review has not started. Documents on file are not findings.",
    updatedAt: "2026-09-12T21:40:00.000Z",
    isDemo: true,
  },
  {
    id: "opp_demo_atlas",
    companyName: "Atlas Quantum Compute",
    instrument: "safe",
    claimedSummary:
      "Claimed SAFE assignment from a 2024 financing. Assignment chain and company acknowledgment are absent.",
    source: "Introduced by counsel",
    status: "evidence_pending",
    materialsOnFile: 3,
    missingMaterials: [
      "Executed assignment",
      "Company acknowledgment",
    ],
    limitationNote:
      "A SAFE copy alone does not establish a valid assignment or any right to purchase.",
    updatedAt: "2026-09-10T13:15:00.000Z",
    isDemo: true,
  },
];

export const demoOpportunities: Opportunity[] =
  demoOpportunitiesInput.map((opportunity) =>
    opportunitySchema.parse(opportunity),
  );

export const demoOpportunityCount = demoOpportunities.length;
