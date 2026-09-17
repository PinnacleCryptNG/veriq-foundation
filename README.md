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

Outcomes are limited to **Consistent**, **Attention**, **Insufficient evidence**, and **Not assessed**. There is no Verified, safe, or approved result.

## Local persistence

- Opportunities: `veriq.opportunities.v1`
- Review runs: `veriq.verification-runs.v1` (separate from opportunity records)

Browser `localStorage` is demo-only. It is not secure production storage.

## Manual review workflow

1. Open an opportunity.
2. Add an evidence record.
3. Enter structured details (security type, transfer terms, valuation, and/or transaction amounts). Do not rely on the filename.
4. Open **Review workspace** and click **Run checks**.
5. Inspect findings, evidence links, missing information, and limitations.

## What is not included

- AI document extraction
- External issuer or cap-table lookups
- On-chain ownership checks
- Legal conclusions or fraud detection
- Authentication, backend, or payments
