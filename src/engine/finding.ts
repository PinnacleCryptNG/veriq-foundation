import type { Finding, FindingCategory, RuleId, VerificationState } from "@/types/verification";

export const STANDARD_LIMITATION =
  "This is a demo review of user-entered claims and structured evidence values. It is not independent legal, financial, issuer, ownership, or document-authenticity verification. Uploaded files are not read.";

export function createFinding(
  ruleId: RuleId,
  category: FindingCategory,
  fields: {
    title: string;
    state: VerificationState;
    explanation: string;
    comparedFields: string[];
    evidenceIds: string[];
    missingInformation: string[];
    limitation?: string;
  },
): Finding {
  return {
    id: `finding-${ruleId}`,
    ruleId,
    category,
    title: fields.title,
    state: fields.state,
    explanation: fields.explanation,
    comparedFields: fields.comparedFields,
    evidenceIds: [...fields.evidenceIds].sort(),
    missingInformation: fields.missingInformation,
    limitation: fields.limitation ?? STANDARD_LIMITATION,
  };
}

export function fieldPath(evidenceId: string, detail: string): string {
  return `evidence[${evidenceId}].details.${detail}`;
}
