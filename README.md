# VERIQ

Private-market opportunity review workspace. Reviewers capture deal claims, attach evidence metadata, enter structured evidence values, and run deterministic checks.

This is a **demo review tool**. It is not independent legal, financial, issuer, ownership, or document-authenticity verification. Submitted documents do not establish legal ownership, issuer approval, authenticity, or investment safety.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- Lucide icons
- Zod for intake, structured evidence, and review-run validation
- Vitest for the verification engine

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Workspace overview |
| `/opportunities` | Demo and locally created opportunities |
| `/opportunities/new` | Intake form |
| `/opportunities/[id]` | Opportunity detail, evidence, structured values |
| `/opportunities/[id]/review` | Deterministic review workspace |

## Review checks (ruleset `2026.09.1`)

| ID | Check |
| --- | --- |
| R01 | Security representation consistency |
| R02 | Transferability review |
| R03 | Valuation reference context |
| R04 | Transaction arithmetic (integer minor units, 1-cent tolerance) |
| R05 | Evidence completeness |

Findings use only **explicitly entered structured values**. Filenames, MIME types, descriptions, and file bytes are not read as document contents.

## Finding states

| State | Meaning |
| --- | --- |
| Consistent | That specific comparison of entered values matched. Not legitimacy, safety, or ownership. |
| Attention | A mismatch or reported restriction in entered values. Not proof of fraud. |
| Insufficient evidence | Required structured inputs were missing. |
| Not assessed | The check did not confirm the claim. Not a successful result. |

Input completeness is a field checklist. It is not a risk score or verification verdict.

## Guided demo scenario

**Lumen Harbor Analytics** (`opp_demo_lumen`) is a synthetic packet labeled as demo data. It is not a real company.

Expected findings when you click **Run checks** without editing:

| Rule | Expected state | Why |
| --- | --- | --- |
| R01 | Attention | Claimed common stock vs structured SPV interest |
| R02 | Attention | Structured terms say issuer approval is required |
| R03 | Consistent | Asking-price reference matches USD 18.00 per share |
| R04 | Insufficient evidence | Quantity, price, and fees are entered; stated payment is omitted |
| R05 | Insufficient evidence | Completeness roll-up of the missing stated payment |

400 × 18.00 + 25.00 = 7225.00. Entering `7225.00` as the stated payment and re-running should make R04 and R05 Consistent. The previous run stays in history.

## Local persistence

- Opportunities: `veriq.opportunities.v1`
- Review runs: `veriq.verification-runs.v1` (separate from opportunity records)

Browser `localStorage` is demo-only. It is not secure production storage.

## Manual review workflow

1. Open **Lumen Harbor Analytics** from Overview or Opportunities.
2. Read the review-readiness guide and the structured field groups on each evidence record.
3. Enter values from the submitted evidence only. Do not guess from filenames.
4. Open **Review workspace** and click **Run checks**.
5. Follow evidence links from findings to the corresponding record.
6. Edit a structured value, run checks again, and confirm the previous run is unchanged.

## What is not included

- AI document extraction
- External issuer or cap-table lookups
- On-chain ownership checks
- Legal conclusions or fraud detection
- Authentication, backend, or payments
