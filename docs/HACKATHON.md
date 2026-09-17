# Hackathon submission draft

This draft describes the product that exists in this repository. It does not invent judging criteria, sponsor integrations, or track eligibility.

Official hackathon materials were not supplied in this repo. **Do not assert STOCKLANA (or any other) track eligibility from this document.** Confirm track fit, submission format, and required artifacts against the official brief before submitting.

## Project name and one-line description

**VERIQ** — a local, evidence-based review workspace that compares claimed private and pre-IPO equity opportunity terms with reviewer-entered structured evidence using deterministic ruleset 2026.09.1.

## Problem statement

Private and pre-IPO opportunity packets mix claimed share classes, transfer language, valuation figures, and payment math. Reviewers often have to hold those comparisons in notes or spreadsheets, while filenames and PDFs get treated as if they had already been checked. Conflicts and missing fields are easy to miss, and a later edit can erase what was reviewed earlier.

## Solution

VERIQ lets a reviewer capture the claimed packet, attach evidence records, type structured values from those materials, and run a fixed ruleset. Findings cite the fields and evidence ids they used. Re-running checks appends a new snapshot; earlier runs stay in history. The engine does not read files, call issuers, or produce a score.

## Intended users

Analysts and reviewers who evaluate private-market or pre-IPO opportunity packets and need a repeatable comparison of claims vs entered evidence — not a substitute for legal, issuer, or investment sign-off.

## Core user workflow

1. Open **Overview** (`/`) to see what VERIQ is, the five implemented checks, and the local queue.
2. Open or create an **opportunity**. Seeded demo records are labeled Demo; Lumen Harbor Analytics is labeled a synthetic demo scenario.
3. On the opportunity page, review claimed terms and enter structured values on evidence records. Input-completeness guidance lists missing fields per check.
4. Open **Review workspace** and click **Run checks**.
5. Read finding states (Attention, Insufficient evidence, Not assessed, Consistent). Follow **Open evidence record** / **Structured details** links.
6. Edit a structured value, click **Run checks** again, then open the earlier snapshot in **Review history**.

## Technical implementation

- **App:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Zod validation, Vitest.
- **Engine:** Pure `evaluateOpportunity` in `src/engine/`. No DOM, network, AI, or storage access. Ruleset `2026.09.1` (R01–R05). Integer minor-unit money with a 1-cent match tolerance.
- **Persistence:** Browser `localStorage` keys `veriq.opportunities.v1` and `veriq.verification-runs.v1`. Opportunity records and review runs are stored separately. At most 20 runs per opportunity. Demo-only; not production storage.
- **Demo data:** Seeded opportunities, including synthetic **Lumen Harbor Analytics** (`opp_demo_lumen`). Seeds are merged only when missing; user-created records are not overwritten.

See [ARCHITECTURE.md](ARCHITECTURE.md) for routes, schemas, and trust boundaries.

## What is implemented in the demo

- Opportunity intake and a local opportunity list
- Evidence records with optional file metadata and structured field groups
- Input-completeness guidance for R01–R05
- Deterministic review runs with evidence traceability
- Historical run snapshots that do not change when evidence is edited
- Lumen Harbor Analytics walkthrough: mixed first-run findings; presenter enters stated payment **7225.00**; second run; preserved history
- Explicit limitation copy: findings are not ownership, authenticity, legitimacy, safety, or investment-quality proof

## Current limitations

- Client-only demo. Clearing site data removes local records.
- Files are not read. Structured values must be typed by the reviewer.
- No authentication, multi-user sharing, backend, or issuer confirmation.
- No scores, pass/fail verdict, or “Verified” badge.
- Ruleset is the implemented five checks only. Completeness of those fields is not a complete diligence packet.
- localStorage is not secure, durable, or multi-device storage.

## Potential future directions (not implemented)

Labeled **future work** — not present in this demo:

- Server-backed persistence and multi-reviewer workspaces
- Assisted extraction of structured fields from documents, with human confirmation still required
- Optional issuer or transfer-agent lookups that remain clearly separate from local findings
- Additional rules, still deterministic and still without a composite “trust score”
- Export of a review-run snapshot for an audit folder

None of the above should be described as shipped.

## Track fit — confirmation required

This repository does not contain official STOCKLANA (or other hackathon) rules, track lists, or judging criteria.

Before claiming a track:

- Confirm the official track definitions and eligibility for the submission cycle.
- Confirm whether a local, no-backend review tool matches the required theme (for example private-market tooling vs on-chain verification vs AI products).
- Confirm required artifacts (demo video length, repo URL, license, team size).
- Do not treat this draft as evidence of eligibility.

If the brief requires issuer connectivity, blockchain settlement, or automated document verification, VERIQ as implemented does **not** satisfy those requirements.

---

# Live demo script (2–3 minutes)

Match this script to the current UI. Button labels in **bold** exist in the app. Do not pre-fill stated payment `7225.00`.

## 0. Before you start (off-camera)

- `npm run dev` → [http://127.0.0.1:43147](http://127.0.0.1:43147)
- Prefer a browser profile without a leftover Lumen stated payment. If **Stated payment amount** already shows `7225.00`, clear that field and save, or use a clean profile, so the first run still shows Insufficient evidence on R04/R05.

## 1. Introduce VERIQ (~25 seconds) — Overview (`/`)

**Say:** “VERIQ is a local review workspace for private and pre-IPO equity packets. It compares claimed deal terms with structured values a reviewer types from submitted materials. It is not issuer confirmation, and it does not prove ownership, authenticity, or that an investment is safe.”

**Do:** Stay on **Overview**. Point to **About this workspace**, then **Implemented checks · ruleset 2026.09.1** (R01–R05).

**Say:** “Five deterministic checks. Findings are Consistent, Attention, Insufficient evidence, or Not assessed. Consistent means the entered numbers matched — not that the deal is verified.”

## 2. Open the synthetic packet (~20 seconds)

**Do:** Click **Open Lumen Harbor Analytics** (suggested walkthrough or the synthetic demo notice). You land on `/opportunities/opp_demo_lumen`.

**Say:** “Lumen Harbor Analytics is a synthetic demo packet, not a real company. The opportunity claims 400 common shares at 18 dollars. Structured evidence already includes an SPV-interest memo, issuer-approval transfer terms, a matching asking-price worksheet, and a transaction worksheet that omits stated payment.”

**Do:** Scroll the evidence list enough to show those records. Point at **Review readiness** if it is on screen (R04 should still need stated payment). Do **not** enter 7225.00 yet.

**Do:** Click **Open review workspace**.

## 3. First review run (~40 seconds) — Review workspace

**Do:** Click **Run checks**.

**Highlight:**

- **Review summary** counts: Attention 2, Insufficient evidence 2, Consistent 1
- **R01** Attention — claimed common stock vs structured SPV interest
- **R02** Attention — issuer approval required
- **R03** Consistent — asking-price 18.00 matches the quote
- **R04** Insufficient evidence — stated payment missing
- **R05** Insufficient evidence — completeness roll-up of that gap

**Say:** “One packet, mixed outcomes. That mix is the point. It is not a verified, safe, or approved result.”

**Do:** On the R04 card, click **Open evidence record** or **Structured details** (or the walkthrough button **Open transaction worksheet**). That jumps to the opportunity page, hash `#evidence-evd_demo_lumen_tx`.

## 4. Enter 7225.00 (~25 seconds) — Transaction worksheet

**Where:** Opportunity detail, evidence record **Transaction worksheet (synthetic demo)**, field **Stated payment amount**.

**Do:** Type `7225.00`. Click **Save structured details**. Confirm the line “Saved locally. This is not a verification result.”

**Say:** “Four hundred times 18, plus 25 in fees, is 7225. The presenter types that amount. The app does not invent it.”

**Do:** Click **Open review workspace** again (header, or the walkthrough hint).

## 5. Second run and history (~30 seconds)

**Do:** Click **Run checks**.

**Say:** “R04 and R05 should now be Consistent. R01 stays Attention — matching payment math does not resolve the security-type conflict.”

**Do:** Scroll to **Review history**. Click the earlier run (the one that is not **Latest**). Confirm the banner: you are viewing a historical snapshot. R04 on that snapshot should still show Insufficient evidence.

**Say:** “Edits and new runs do not rewrite what was already recorded.”

## 6. Close (~20 seconds)

**Say:** “VERIQ makes claim-versus-entered-evidence comparisons explicit and repeatable. It does not read documents, call an issuer, score the deal, or prove that anyone owns anything. What you saw is a local demo of structured review — not independent verification.”

**Stop.** Do not show New opportunity unless there is leftover time; it is intake only and does not change the Lumen story.
