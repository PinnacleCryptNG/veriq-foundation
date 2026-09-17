# Architecture

This document describes the implementation in this repository. Planned work is labeled as such.

VERIQ is a Next.js App Router workspace. Opportunity records and review runs live in the browser. A Next.js Route Handler proxies the official public PreStocks catalog. There is no authentication, trading, or issuer lookup.

## Application routes and user flow

| Path | UI | What the reviewer does |
| --- | --- | --- |
| `/` | Overview | Read what VERIQ is, the implemented checks, and the local opportunity queue. Open Lumen Harbor Analytics or create a record. |
| `/opportunities` | Opportunity list | Browse seeded demo records and records created in this browser. |
| `/opportunities/new` | Intake form | Capture claimed company, instrument, seller/intermediary, quantity, quoted price, currency, and summary. Saving creates a local record; it does not start a review run. |
| `/opportunities/[id]` | Opportunity detail | Inspect claimed terms, missing-materials notes, input-completeness guidance, evidence records, and structured field groups. |
| `/opportunities/[id]/review` | Review workspace | Click **Run checks**, inspect findings, follow evidence links, and open earlier snapshots in **Review history**. Optionally attach a PreStocks catalog row as market context. |
| `/prestocks` | PreStocks catalog | Browse/search live catalog rows. Refresh re-requests the official list through the server proxy. |
| `/prestocks/[symbol]` | PreStocks asset | View catalog fields, source URL, retrieval time, and freshness. Attach as a reference for an opportunity when opened with `?opportunity=`. |

Typical flow: Overview or Opportunities → opportunity detail (evidence and structured values) → **Open review workspace** → **Run checks** → follow a finding to an evidence record → edit a structured value → **Run checks** again → open the earlier run in **Review history**.

Optional PreStocks flow: **PreStocks** nav or **PreStocks reference** on an opportunity → select a catalog row → labeled comparison of submitted quotes vs token-market fields → return to the opportunity or review workspace.

Navigation is Overview, Opportunities, and PreStocks.

## Opportunity data model

Source of truth: `src/types/opportunity.ts`.

An **opportunity** is a claimed private-market packet:

- Identity and claims: `companyName`, `instrument`, optional `shareClass`, `sellerOrIntermediary`, optional `quantityOffered` / `quotedPrice` / `currency`, `claimedSummary`, `source`
- Workspace metadata: `status`, `missingMaterials`, `limitationNote`, `createdAt`, `updatedAt`, `isDemo`
- `evidence[]` — local evidence records on that opportunity

Intake status (`intake_incomplete`, `evidence_pending`, `queued_for_review`) is derived from whether claimed materials have been collected. It is **not** a review finding.

## Evidence records and structured details

Each evidence item has:

- Type (`ownership_document`, `transaction_agreement`, `valuation_reference`, `transfer_terms`, `other`)
- Display name, optional description
- Optional file metadata (`fileName`, `fileSize`, `mimeType`, `bytesPersisted`, optional `dataUrl`)
- Optional `storageNote`
- Optional `structuredDetails`

Structured details (`src/types/verification.ts`) are the only evidence values the engine reads:

- `securityType`
- `transfer.restriction`
- `valuation` (amount, currency, unit, reference type, optional date/basis)
- `transaction` (quantity, unit price, currency, optional fees, optional `statedTotal`)

Filenames, MIME types, descriptions, and file bytes are **not** parsed as document contents. Attachments larger than 256 KiB store metadata only. File presence does not prove authenticity or ownership.

Input-completeness guidance (`src/lib/review-readiness.ts` and `src/config/evidence-guidance.ts`) lists which structured fields each implemented check needs. That checklist is not a risk score.

## Deterministic review engine and ruleset

Source of truth: `src/engine/`. Ruleset version is `2026.09.1` (`RULESET_VERSION` in `src/types/verification.ts`).

`evaluateOpportunity` is a pure function. It does not read `localStorage`, React state, the DOM, the network, or uploaded files. The UI maps an opportunity to `EngineInput` with `toEngineInput` (claimed opportunity fields plus each record’s `structuredDetails`).

| Rule | Category | What it compares |
| --- | --- | --- |
| R01 | Security representation | Opportunity `instrument` vs entered `securityType` values |
| R02 | Transferability | Entered transfer restriction. `issuer_approval_required` or `restricted` → Attention. `no_restriction_stated` → **Not assessed**, not Consistent |
| R03 | Valuation reference | Quoted price vs a comparable `asking_price` valuation in the same currency and a compatible unit |
| R04 | Transaction arithmetic | Quantity × unit price, plus fees if entered, vs stated payment |
| R05 | Evidence completeness | Whether R01–R04 had the structured fields they need |

Money uses integer minor units (2 decimal places). Quantities use 6 decimal places. Quantity × price rounds half-up to cents. Amounts match when they differ by at most **1 cent**. Floating-point equality is not used.

Finding states: `consistent`, `attention`, `insufficient_evidence`, `not_assessed`. **Consistent** means that specific comparison of entered values matched. It is not legitimacy, safety, ownership, or investment quality.

## Verification-run snapshots and history

A **verification run** (`src/types/verification.ts`) stores:

- `id`, `opportunityId`, `timestamp`, `rulesetVersion`
- `findings[]` and `summary` counts
- Optional `inputSnapshot` (the `EngineInput` used)
- Optional `evidenceCatalog` (`id` + `displayName` at run time)

Clicking **Run checks** evaluates the current opportunity, then appends a new run. Historical runs are not mutated when evidence is edited or checks are run again. The review workspace can show an earlier snapshot; a banner states that you are viewing history.

Storage keeps at most **20** runs per opportunity (`MAX_RUNS_PER_OPPORTUNITY`). Older runs for that opportunity are dropped from the saved list after the cap.

## Separation between opportunity records and review runs

| Store | Key | Contents |
| --- | --- | --- |
| Opportunities | `veriq.opportunities.v1` | Opportunity records, including evidence and structured details |
| Review runs | `veriq.verification-runs.v1` | Immutable run snapshots keyed by `opportunityId` |
| PreStocks references | `veriq.prestocks-references.v1` | Optional `{ opportunityId, symbol, selectedAt }` selections. Failure or clearing this store does not rewrite opportunity records or review runs. |

Unreadable review storage does not delete opportunity records. Unreadable opportunity storage is ignored and seeded demo records remain available. User-created opportunities are not replaced by demo seeds: `mergeWithDemoSeeds` only inserts a seed when that seed id is missing.

## LocalStorage-based demo persistence

Repositories: `src/lib/storage/opportunities-repository.ts` and `src/lib/storage/verification-repository.ts`.

- Client-only. Server snapshots are empty.
- Zod validates records on read; invalid items are skipped with a warning.
- If `localStorage` is unavailable or a write fails, the session keeps an in-memory copy and surfaces a persist error.
- This is **not** secure production storage. It is limited to the current browser profile and can be cleared by the browser.

Seeded demo opportunities live in `src/data/demo-opportunities.ts`. Lumen Harbor Analytics (`opp_demo_lumen`) is the synthetic guided scenario. Its stated payment is intentionally omitted so the presenter can enter `7225.00`. The Lumen seed is not modified by PreStocks selection.

## PreStocks integration

Official materials verified for this milestone:

- Catalog: `GET https://prestocks.com/api/prestocks` (also served at `https://www.prestocks.com/api/prestocks`)
- Products page: `https://prestocks.com/products`
- Response: JSON array. Observed fields: `name`, `symbol`, `description`, `image`, `external_url`, `contract_address`, `markPrice`, `markValuation`, `tokenPrice`, `impliedValuation`, `supply`
- Authentication: none required for this GET. No API key is used.
- Cache-Control from PreStocks: `public, max-age=0, must-revalidate`. No rate-limit headers were present on the inspected response.
- No other official API paths were documented at `/api`, `/docs`, or `/developers` (those URLs 404). VERIQ does **not** call guessed per-asset PreStocks endpoints. A symbol view filters the retrieved list.

Server module: `src/lib/prestocks/client.ts`. Route handlers:

- `GET /api/market/prestocks` — validated catalog
- `GET /api/market/prestocks/[symbol]` — one row from that same catalog

Optional server env `PRESTOCKS_API_URL` overrides the upstream catalog URL for tests. It is not a secret key. Client UI calls only `/api/market/prestocks`.

Freshness labels:

| Label | Meaning |
| --- | --- |
| live | Just fetched and schema-validated |
| cached | Same snapshot reused inside a 30-second window; retrieval time is shown |
| stale | Live fetch failed; last good snapshot is shown with an explicit stale warning |
| unavailable | No snapshot to show; no prices are invented |

The catalog payload has **no market-data timestamp**. VERIQ records `retrievedAt` when it receives the array. Currency is **not** in the payload; numbers are shown as API fields.

PreStocks data is never passed to `evaluateOpportunity`. Attaching a reference does not change finding states.

## Trust boundaries

Implemented:

- Compare user-entered claims with user-entered structured values
- Cite evidence ids used in a finding
- Preserve historical run snapshots separately from the live opportunity
- Read-only PreStocks catalog as labeled market context, isolated from review runs

Not implemented, and not claimed:

- Document reading, OCR, or AI extraction
- Issuer, transfer-agent, or cap-table confirmation
- Authentication, multi-user accounts, or production storage
- Trading, wallets, orders, or custody
- Marketplace, scoring, or a “Verified” badge
- Proof of ownership, authenticity, legitimacy, safety, or investment quality
- Treating a PreStocks token price as a share quote or as a Consistent finding

## Implemented vs planned

| Implemented | Not in this repository |
| --- | --- |
| Local intake, evidence metadata, structured values | Server-side persistence |
| Ruleset 2026.09.1 (R01–R05) | Additional rules or rule-semantics changes |
| Review workspace, readiness checklist, run history | AI extraction, issuer lookup |
| Lumen Harbor synthetic demo walkthrough | Auth, payments, marketplace, trading |
| Browser localStorage demo persistence | Production-grade storage or audit log |
| Read-only PreStocks catalog proxy + market reference panel | Additional undocumented PreStocks APIs |

Future directions belong in [HACKATHON.md](HACKATHON.md) and are labeled as future work there. They are not present in the running app.
