import type { Finding } from "@/types/verification";

export interface FindingBuyerGuidance {
  differsOrMissing: string;
  whyItMatters: string;
  nextAction: string;
}

export function getFindingBuyerGuidance(finding: Finding): FindingBuyerGuidance {
  switch (finding.ruleId) {
    case "R01": {
      if (finding.state === "attention") {
        return {
          differsOrMissing:
            "The seller pitched direct company equity (like common stock), but the entered documents describe an indirect vehicle (such as an SPV interest).",
          whyItMatters:
            "Indirect SPV holdings carry manager fees, carry, voting limits, and liquidation preferences distinct from owning direct stock on the company cap table.",
          nextAction:
            "Ask the seller to provide the actual cap table entry or clarify if you are purchasing direct shares or a membership interest in an intermediary LLC.",
        };
      }
      if (finding.state === "consistent") {
        return {
          differsOrMissing:
            "The security description in the entered document matches what the seller offered.",
          whyItMatters:
            "Both records describe the same instrument type. However, this only confirms agreement between entered text—it does not prove issuer endorsement.",
          nextAction:
            "Confirm that the issuing company permits secondary transfers for this share class.",
        };
      }
      return {
        differsOrMissing:
          "No document or structured record specifies what security or interest is actually being transferred.",
        whyItMatters:
          "You cannot confirm whether you are buying common equity, preferred equity, an SPV unit, or a SAFE.",
        nextAction:
          "Request a written agreement, certificate, or transfer notice specifying the exact security series before proceeding.",
      };
    }

    case "R02": {
      if (finding.state === "attention") {
        return {
          differsOrMissing:
            "The entered transfer document explicitly flags a restriction or requires issuer consent/approval.",
          whyItMatters:
            "Private companies frequently hold a Right of First Refusal (ROFR) or prohibit unapproved transfers. If company consent is withheld, your purchase may be deemed void.",
          nextAction:
            "Require seller to provide formal written issuer approval or an explicit company ROFR waiver before releasing funds.",
        };
      }
      if (finding.state === "not_assessed") {
        return {
          differsOrMissing:
            "The document states no restrictions were noted, but company bylaws were not independently audited.",
          whyItMatters:
            "A seller's statement of 'no restrictions' in their own worksheet does not substitute for company bylaws or issuer consent.",
          nextAction:
            "Verify company transfer bylaws directly with the issuer or legal counsel.",
        };
      }
      return {
        differsOrMissing:
          "No transfer terms or restriction details were provided in the entered evidence.",
        whyItMatters:
          "Unstated transfer terms leave you vulnerable to undisclosed transfer lockups or company vetoes.",
        nextAction:
          "Ask the seller for the transfer agreement section governing board approval and ROFR timelines.",
      };
    }

    case "R03": {
      if (finding.state === "attention") {
        return {
          differsOrMissing:
            "The quoted per-share deal price differs from the valuation figure entered from reference documentation.",
          whyItMatters:
            "You may be paying an undisclosed premium or looking at figures from a different funding round or valuation tier.",
          nextAction:
            "Reconcile the pricing gap with the seller and confirm which funding round or benchmark valuation applies.",
        };
      }
      if (finding.state === "consistent") {
        return {
          differsOrMissing:
            "The quoted asking price aligns mathematically with the entered valuation reference document.",
          whyItMatters:
            "The seller's quote matches the documentation provided for that round, though this does not guarantee current market fair value.",
          nextAction:
            "Review secondary market context (e.g. PreStocks benchmarks) to gauge broader valuation ranges.",
        };
      }
      return {
        differsOrMissing:
          "No structured valuation reference or asking-price comparison document was attached.",
        whyItMatters:
          "Without an independent reference or agreement sheet, you are relying solely on the seller's verbal/email price quote.",
        nextAction:
          "Obtain an official 409A summary, term sheet excerpt, or recent trade confirmation to cross-check price.",
      };
    }

    case "R04": {
      if (finding.state === "attention") {
        return {
          differsOrMissing:
            "The stated total payment amount does not match (Quantity × Unit Price) + Stated Fees.",
          whyItMatters:
            "An arithmetic mismatch means hidden fees, unrecorded commissions, or wire calculation errors exist in the settlement figures.",
          nextAction:
            "Review the wire breakdown line-by-line and correct the stated payment calculation before sending payment.",
        };
      }
      if (finding.state === "consistent") {
        return {
          differsOrMissing:
            "Total stated wire/payment matches the product of quantity, unit price, and stated fees.",
          whyItMatters:
            "Deal arithmetic is consistent within 1 cent. (Note: this confirms arithmetic, not that money has actually moved or escrow is funded).",
          nextAction:
            "Ensure escrow agreements match these exact wire figures before sending funds.",
        };
      }
      return {
        differsOrMissing:
          "Transaction arithmetic cannot be verified because required figures (quantity, price, currency, or stated payment) are missing.",
        whyItMatters:
          "You cannot confirm whether transaction fees or closing costs have been properly accounted for.",
        nextAction:
          "Complete the transaction worksheet with the exact share quantity, price per share, and expected total wire amount.",
      };
    }

    case "R05": {
      if (finding.state === "consistent") {
        return {
          differsOrMissing:
            "All structured inputs required for the 5 deterministic rules are present.",
          whyItMatters:
            "All available checks were evaluated. However, full input presence does not authenticate the documents themselves.",
          nextAction:
            "Review each individual finding above to ensure all specific caveats have been addressed.",
        };
      }
      return {
        differsOrMissing:
          "Several checks lack the required structured inputs needed to evaluate the deal.",
        whyItMatters:
          "Checks with missing data produce 'Insufficient evidence' rather than checking for mismatches.",
        nextAction:
          "Fill in the missing fields noted in the opportunity detail worksheets to run a complete evaluation.",
      };
    }
  }
}
