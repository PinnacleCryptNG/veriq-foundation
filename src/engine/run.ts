import { evaluateSecurityRepresentation } from "@/engine/rules/r01-security-representation";
import { evaluateTransferability } from "@/engine/rules/r02-transferability";
import { evaluateValuationReference } from "@/engine/rules/r03-valuation-reference";
import { evaluateTransactionArithmetic } from "@/engine/rules/r04-transaction-arithmetic";
import { evaluateEvidenceCompleteness } from "@/engine/rules/r05-evidence-completeness";
import {
  RULESET_VERSION,
  engineInputSchema,
  type EngineInput,
  type Finding,
  type VerificationEvaluation,
  type VerificationSummary,
} from "@/types/verification";

const RULES = [
  evaluateSecurityRepresentation,
  evaluateTransferability,
  evaluateValuationReference,
  evaluateTransactionArithmetic,
  evaluateEvidenceCompleteness,
] as const;

export function summarizeFindings(findings: Finding[]): VerificationSummary {
  return {
    consistent: findings.filter((finding) => finding.state === "consistent").length,
    attention: findings.filter((finding) => finding.state === "attention").length,
    insufficient_evidence: findings.filter(
      (finding) => finding.state === "insufficient_evidence",
    ).length,
    not_assessed: findings.filter((finding) => finding.state === "not_assessed")
      .length,
  };
}

export function evaluateOpportunity(input: EngineInput): VerificationEvaluation {
  const parsed = engineInputSchema.parse(input);
  const findings = RULES.map((rule) => rule(parsed));

  return {
    rulesetVersion: RULESET_VERSION,
    findings,
    summary: summarizeFindings(findings),
  };
}
