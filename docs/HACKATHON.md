# Hackathon submission draft

This draft describes the product that exists in this repository. Official STOCKLANA materials supplied for this milestone: the “Best Use of PreStocks” track brief, plus `https://prestocks.com/api/prestocks` and `https://prestocks.com/products`.

Do not treat this draft as a judging score or a guarantee of track eligibility. Confirm remaining submission artifacts (video length, team size, license) against the rest of the official packet.

## Project name and one-line description

**VERIQ** — a local, evidence-based review workspace that compares claimed private and pre-IPO equity terms with reviewer-entered structured evidence (ruleset 2026.09.1) and can attach a live PreStocks catalog row as labeled market context.

## Problem statement

Private and pre-IPO opportunity packets mix claimed share classes, transfer language, valuation figures, and payment math. Reviewers often have to hold those comparisons in notes or spreadsheets, while filenames and PDFs get treated as if they had already been checked. Conflicts and missing fields are easy to miss, and a later edit can erase what was reviewed earlier.

## Solution

VERIQ lets a reviewer capture the claimed packet, attach evidence records, type structured values from those materials, and run a fixed ruleset. Findings cite the fields and evidence ids they used. Re-running checks appends a new snapshot; earlier runs stay in history. The engine does not read files, call issuers, or produce a score.

Separately, VERIQ loads the official PreStocks catalog (read-only) so a reviewer can see token-market fields next to a claimed opportunity. That catalog is not evidence and does not change finding states.

## Intended users

Analysts and reviewers who evaluate private-market or pre-IPO opportunity packets and need a repeatable comparison of claims vs entered evidence — not a substitute for legal, issuer, or investment sign-off.

## Core user workflow

1. Open **Overview** (`/`) to see what VERIQ is, the five implemented checks, and the local queue.
2. Open or create an **opportunity**. Seeded demo records are labeled Demo; Lumen Harbor Analytics is labeled a synthetic demo scenario.
3. On the opportunity page, review claimed terms and enter structured values on evidence records. Input-completeness guidance lists missing fields per check.
4. Open **Review workspace** and click **Run checks**.
5. Read finding states (Attention, Insufficient evidence, Not assessed, Consistent). Follow **Open evidence record** / **Structured details** links.
6. Edit a structured value, click **Run checks** again, then open the earlier snapshot in **Review history**.
7. Optionally open **PreStocks**, pick a catalog row, and attach it as market context on the opportunity. Return via **Back to opportunity** / **Return to review workspace**.

## Technical implementation

- **App:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Zod validation, Vitest.
- **Engine:** Pure `evaluateOpportunity` in `src/engine/`. No DOM, network, AI, or storage access. Ruleset `2026.09.1` (R01–R05). Integer minor-unit money with a 1-cent match tolerance.
- **Persistence:** Browser `localStorage` keys `veriq.opportunities.v1`, `veriq.verification-runs.v1`, and `veriq.prestocks-references.v1`. Opportunity records and review runs stay separate from PreStocks selections.
- **PreStocks:** Server fetch of `GET https://prestocks.com/api/prestocks`, Zod validation, freshness labels (live / cached / stale / unavailable). Client UI calls `/api/market/prestocks` only. No API key. No trading.
- **Demo data:** Seeded opportunities, including synthetic **Lumen Harbor Analytics** (`opp_demo_lumen`). Seeds are merged only when missing; user-created records are not overwritten.

See [ARCHITECTURE.md](ARCHITECTURE.md) for routes, schemas, and trust boundaries.

## What is implemented in the demo

- Opportunity intake and a local opportunity list
- Evidence records with optional file metadata and structured field groups
- Input-completeness guidance for R01–R05
- Deterministic review runs with evidence traceability
- Historical run snapshots that do not change when evidence is edited
- Lumen Harbor Analytics walkthrough: mixed first-run findings; presenter enters stated payment **7225.00**; second run; preserved history
- Read-only PreStocks catalog browse/search, asset provenance, and optional per-opportunity market reference
- Explicit limitation copy: findings are not ownership, authenticity, legitimacy, safety, or investment-quality proof; PreStocks tokens are not treated as direct share ownership

## Current limitations

- Client-only demo. Clearing site data removes local records.
- Files are not read. Structured values must be typed by the reviewer.
- No authentication, multi-user sharing, or production storage.
- No scores, pass/fail verdict, or “Verified” badge.
- PreStocks catalog has no currency code and no market-data timestamp in the API payload. VERIQ shows retrieval time instead.
- No trading, wallet, mint, or redemption flows.
- Only the documented list endpoint is used. Per-asset views filter that list.
- Ruleset is the implemented five checks only. Completeness of those fields is not a complete diligence packet.
- localStorage is not secure, durable, or multi-device storage.

## Potential future directions (not implemented)

Labeled **future work** — not present in this demo:

- Server-backed persistence and multi-reviewer workspaces
- Assisted extraction of structured fields from documents, with human confirmation still required
- Optional issuer or transfer-agent lookups that remain clearly separate from local findings
- Additional documented PreStocks endpoints if PreStocks publishes them
- Additional rules, still deterministic and still without a composite “trust score”
- Export of a review-run snapshot for an audit folder

None of the above should be described as shipped.

## Track fit — supplied PreStocks brief

Supplied brief: *Build your project using PreStocks (tokenized pre-IPO stocks). Creativity, integration depth, and product quality will be considered.*

What this repo actually does with that brief:

- Uses the official PreStocks catalog as a first-class, read-only surface inside the analyst workspace
- Lets a reviewer attach a catalog row while reviewing a private/pre-IPO packet, with source, retrieval time, and trust copy
- Keeps PreStocks data out of the deterministic ruleset so token prices cannot silently become a Consistent finding

What still must be confirmed from other official materials: submission format, demo-video rules, team eligibility, and any additional track constraints not in the supplied paragraph. This draft does not claim a win, a score, or that tokenized SPV exposure is the same as owning issuer shares.

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

## 6. PreStocks market reference (~25 seconds)

**Do:** From the review header click **PreStocks reference**, or use the **PreStocks** nav item.

**Say:** “This is the live PreStocks catalog. Tokens track pre-IPO prices via SPV exposure. That is not the same as owning the company’s shares, and it is not a VERIQ finding.”

**Do:** Open **OpenAI PreStocks** (or any listed row). Point at **tokenPrice**, **markPrice**, **Retrieved at**, and **Freshness**. If showing Lumen, note there is no matching PreStocks row for that synthetic issuer.

**Do:** Click **Back to catalog** or **Back to opportunity** / **Return to review workspace**.

**Say:** “Selecting a row is optional context. It does not change R01–R05.”

## 7. Close (~15 seconds)

**Say:** “VERIQ makes claim-versus-entered-evidence comparisons explicit and repeatable, and it can place a live PreStocks catalog next to those claims. It does not read documents, call an issuer, trade tokens, score the deal, or prove that anyone owns anything.”

**Stop.**
