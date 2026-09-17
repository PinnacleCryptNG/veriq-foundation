# Architecture

This document describes the implementation in this repository. Planned work is labeled as such.

VERIQ is a Next.js App Router client workspace. Opportunity records and review runs live in the browser. There is no application backend, authentication, or external issuer lookup.

## Application routes and user flow

| Path | UI | What the reviewer does |
| --- | --- | --- |
| `/` | Overview | Read what VERIQ is, the implemented checks, and the local opportunity queue. Open Lumen Harbor Analytics or create a record. |
| `/opportunities` | Opportunity list | Browse seeded demo records and records created in this browser. |
| `/opportunities/new` | Intake form | Capture claimed company, instrument, seller/intermediary, quantity, quoted price, currency, and summary. Saving creates a local record; it does not start a review run. |
| `/opportunities/[id]` | Opportunity detail | Inspect claimed terms, missing-materials notes, input-completeness guidance, evidence records, and structured field groups. |
| `/opportunities/[id]/review` | Review workspace | Click **Run checks**, inspect findings, follow evidence links, and open earlier snapshots in **Review history**. |

Typical flow: Overview or Opportunities → opportunity detail (evidence and structured values) → **Open review workspace** → **Run checks** → follow a finding to an evidence record → edit a structured value → **Run checks** again → open the earlier run in **Review history**.

Navigation is Overview and Opportunities. Detail and review pages are reached from those lists and from in-page links.

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

Unreadable review storage does not delete opportunity records. Unreadable opportunity storage is ignored and seeded demo records remain available. User-created opportunities are not replaced by demo seeds: `mergeWithDemoSeeds` only inserts a seed when that seed id is missing.

## LocalStorage-based demo persistence

Repositories: `src/lib/storage/opportunities-repository.ts` and `src/lib/storage/verification-repository.ts`.

- Client-only. Server snapshots are empty.
- Zod validates records on read; invalid items are skipped with a warning.
- If `localStorage` is unavailable or a write fails, the session keeps an in-memory copy and surfaces a persist error.
- This is **not** secure production storage. It is limited to the current browser profile and can be cleared by the browser.

Seeded demo opportunities live in `src/data/demo-opportunities.ts`. Lumen Harbor Analytics (`opp_demo_lumen`) is the synthetic guided scenario. Its stated payment is intentionally omitted so the presenter can enter `7225.00`.

## Trust boundaries

Implemented:

- Compare user-entered claims with user-entered structured values
- Cite evidence ids used in a finding
- Preserve historical run snapshots separately from the live opportunity

Not implemented, and not claimed:

- Document reading, OCR, or AI extraction
- Issuer, transfer-agent, or cap-table confirmation
- Authentication, multi-user accounts, or a backend
- Marketplace, scoring, or a “Verified” badge
- Proof of ownership, authenticity, legitimacy, safety, or investment quality

## Implemented vs planned

| Implemented | Not in this repository |
| --- | --- |
| Local intake, evidence metadata, structured values | Server-side persistence |
| Ruleset 2026.09.1 (R01–R05) | Additional rules or rule-semantics changes |
| Review workspace, readiness checklist, run history | AI extraction, issuer lookup, external APIs |
| Lumen Harbor synthetic demo walkthrough | Auth, payments, marketplace |
| Browser localStorage demo persistence | Production-grade storage or audit log |

Future directions belong in [HACKATHON.md](HACKATHON.md) and are labeled as future work there. They are not present in the running app.
