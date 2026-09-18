# VERIQ

Spot the mismatches between what the seller told you and what the available evidence supports — before you send money.

VERIQ is an evidence-based review workspace for **private and pre-IPO secondary opportunities**. Reviewers capture claimed deal terms, attach evidence documents, enter structured values, and run deterministic verification checks under ruleset **2026.09.1**.

This is an **objective diligence checklist**. It is not independent legal, financial, issuer, ownership, or document-authenticity verification. Submitted documents do not establish legal ownership, issuer approval, authenticity, or investment safety. Consistent findings do not mean an investment is safe or title is certified.

## Documentation

| Document | Contents |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Routes, data model, persistence, review engine, trust boundaries |
| [docs/HACKATHON.md](docs/HACKATHON.md) | Submission-ready project description and a 2–3 minute live demo script |

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- Lucide icons
- Zod for intake, structured evidence, and review-run validation
- Vitest for the review engine and storage helpers

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
| `/` | Overview: product briefing, implemented checks, opportunity queue |
| `/opportunities` | Demo and locally created opportunities |
| `/opportunities/new` | Intake form |
| `/opportunities/[id]` | Opportunity detail, evidence, structured values |
| `/opportunities/[id]/review` | Deterministic review workspace |
| `/prestocks` | Read-only PreStocks catalog (official list, validated server-side; freshness labeled) |
| `/prestocks/[symbol]` | One PreStocks catalog row as market reference |

## Review checks (ruleset `2026.09.1`)

| ID | Check |
| --- | --- |
| R01 | Security representation consistency |
| R02 | Transferability review |
| R03 | Valuation reference context |
| R04 | Transaction arithmetic (integer minor units, 1-cent tolerance) |
| R05 | Evidence completeness |

Findings use only **explicitly entered structured values**. Filenames, MIME types, descriptions, and file bytes are not read as document contents.

## PreStocks market reference

Read-only integration with the official public catalog:

`GET https://prestocks.com/api/prestocks`

No API key is required. VERIQ fetches that URL on the server, validates the JSON, and exposes it at `/prestocks` and on opportunity/review pages as **market context**. It does not feed ruleset 2026.09.1.

| Path | Purpose |
| --- | --- |
| `/prestocks` | Browse and search the retrieved catalog |
| `/prestocks/[symbol]` | One catalog row, provenance, retrieval time |
| `/api/market/prestocks` | Server proxy + validation for the official list |

Optional env: `PRESTOCKS_API_URL` (server-only override of the catalog URL). See `.env.example`. There is no PreStocks API key in this project. **Refresh catalog** on the UI requests a new fetch (`?refresh=1`) instead of reusing the 30-second cache. Cached and stale snapshots are labeled; they are never shown as live.

PreStocks figures are token-market fields. They are not submitted evidence, not per-share issuer quotes, and not proof of ownership.

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

400 × 18.00 + 25.00 = 7225.00. Entering `7225.00` as **Stated payment amount** on the transaction worksheet, saving, and clicking **Run checks** again should make R04 and R05 Consistent. The previous run stays in **Review history**.

Presenter steps are in [docs/HACKATHON.md](docs/HACKATHON.md). Do not pre-fill `7225.00`; enter it during the demo.

## Local persistence

- Opportunities: `veriq.opportunities.v1`
- Review runs: `veriq.verification-runs.v1` (separate from opportunity records)
- PreStocks reference selections: `veriq.prestocks-references.v1` (does not rewrite opportunity records)

Browser `localStorage` is demo-only. It is not secure production storage. Seeded demo records are merged in when missing; user-created opportunities are not overwritten.

## What is not included

- AI document extraction
- External issuer or cap-table lookups
- On-chain ownership checks
- Legal conclusions or fraud detection
- Authentication, marketplace, scores, or a “Verified” badge
- Trading, wallets, order placement, or custody
- Treating PreStocks token prices as direct share ownership or as a review verdict
