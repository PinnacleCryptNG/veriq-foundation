# Hackathon submission draft

This draft describes the product that exists in this repository. Official STOCKLANA materials supplied for this milestone: the “Best Use of PreStocks” track brief, plus `https://prestocks.com/api/prestocks` and `https://prestocks.com/products`.

Do not treat this draft as a judging score or a guarantee of track eligibility. Confirm remaining submission artifacts (video length, team size, license) against the rest of the official packet.

## Project name and one-line description

**VERIQ** — a local, evidence-based deal review workspace that helps private-market buyers spot mismatches between seller claims and entered evidence before money changes hands, with optional PreStocks secondary benchmark context.

## Problem statement

Private and pre-IPO opportunity packets mix claimed share classes, transfer language, valuation figures, and payment math. Buyers often have to hold those comparisons in notes or spreadsheets, while filenames and PDFs get treated as if they had already been checked. Conflicts and missing fields are easy to miss, and a later edit can erase what was reviewed earlier.

## Solution

VERIQ lets a buyer or reviewer capture what the seller said, attach or type the underlying paperwork, and see deal mismatches in plain English. Findings answer what was found, why it matters, and what to do next. Re-running checks appends a new snapshot; earlier runs stay in history. The engine does not read files, call issuers, or produce a score.

Separately, VERIQ loads the official PreStocks catalog (read-only) so a reviewer can see token-market fields next to a claimed opportunity. That catalog is not evidence and does not change finding states.

## Intended users

Individual secondary buyers evaluating pre-IPO shares, family offices conducting structured first-pass reviews, and brokers preparing transparent deal information.

## Core user workflow

1. Open **Overview** (`/`) to see the condensed Lumen Harbor mismatch proof, the 3-step workflow, and the live demo CTA.
2. Click **Run the 2-minute demo now** to jump directly into the pre-loaded Lumen Harbor review.
3. Review Section 1 (What the seller claims), Section 2 (What information or evidence was entered), and click **Run checks now**.
4. Read plain-English findings answering: What was found, Why it matters, and What you can do. Expand technical details for exact rule IDs and compared values.
5. Follow the walkthrough link to the transaction worksheet, enter stated payment **7225.00**, save, and run checks again.
6. Open the earlier snapshot in **Review history** to confirm immutable historical record preservation.
7. Optionally open **PreStocks**, browse tokens, and attach one as optional benchmark price context.
8. Click **Start a new deal check** to run verification on your own transaction.

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

Match this script to the current UI. Labels in **bold** exist in the app. Do not pre-fill stated payment. The field placeholder is **If stated**, not a saved value.

## 0. Before you start (off-camera)

- `npm run dev` → [http://127.0.0.1:43147](http://127.0.0.1:43147)
- If **Stated payment amount** already contains `7225.00` from a prior run, clear it and click **Save structured details**, or use a clean browser profile, so the first **Run checks** still shows Insufficient evidence on R04/R05.

## 1. Introduce VERIQ (~20 seconds) — Overview (`/`)

**Say:** “VERIQ helps a private-market buyer spot mismatches between what the seller told you and what the available evidence supports — before you send money. It is an objective diligence checklist, not legal or ownership certification.”

**Do:** Point to the hero headline **“Spot the mismatches before you send money”**, the 3-step example story, and the **Featured Guided Demo** for Lumen Harbor Analytics.

**Say:** “Five transparent checks. Consistent means entered numbers matched — not that the deal is approved or safe. PreStocks serves as secondary market context.”

## 2. PreStocks catalog (~25 seconds)

**Do:** Click **PreStocks catalog** (header) or the **PreStocks** nav item.

**Say:** “This is the official PreStocks list, fetched read-only. Tokens track pre-IPO prices via SPV exposure. That is not the same as owning issuer shares.”

**Do:** Point at the freshness banner (**Live** or **Cached**). Open **OpenAI PreStocks** via **View market information**.

**Highlight:** `tokenPrice`, `markPrice`, **Retrieved at**, **Freshness**, and “Not provided by this API” for a market-data timestamp.

**Say:** “VERIQ records when it received the array. PreStocks does not send an exchange timestamp or a currency code.”

**Do:** Click **Back to catalog**, then **Back to opportunities**.

## 3. Lumen packet and first run (~40 seconds)

**Do:** Open **Lumen Harbor Analytics** from Overview or the opportunities list.

**Say:** “Synthetic packet, not a real company. Claimed 400 common shares at 18 dollars. Structured evidence already has an SPV-interest memo, issuer-approval terms, a matching asking-price worksheet, and a transaction worksheet with no stated payment.”

**Do:** Point at **Review readiness** (R04 still needs stated payment). Click **Open review workspace**. Click **Run checks now** (or **Run checks**).

**Highlight:** The 3 primary sections: (1) What the seller claims, (2) What information or evidence was entered, and (3) What VERIQ found. Under findings, read the 3 plain-English buyer answers: What was found, Why it matters, and What you can do. Click **Show values & rule info** to demonstrate progressive disclosure of technical audit details and exact compared fields.

**Highlight states:** Attention 2, Insufficient evidence 2, Consistent 1 — **R01** Attention, **R02** Attention, **R03** Consistent, **R04** Insufficient evidence, **R05** Insufficient evidence.

**Say:** “Mixed outcomes in one packet. That mix is not a verified or safe result.”

## 4. Enter 7225.00, second run, history (~40 seconds)

**Do:** On the R04 card click **Open evidence record** or **Structured details** (or **Open transaction worksheet**).

**Where:** **Transaction worksheet (synthetic demo)** → **Stated payment amount**.

**Do:** Type `7225.00`. Click **Save structured details**.

**Say:** “Four hundred times 18, plus 25 in fees, is 7225. The presenter types it.”

**Do:** Click **Open review workspace**. Click **Run checks**.

**Say:** “R04 and R05 should be Consistent. R01 stays Attention — payment math does not fix the security-type conflict.”

**Do:** In **Review history**, open the earlier row (not **Latest**). Confirm the historical snapshot banner. R04 on that snapshot should still be Insufficient evidence.

**Say:** “New runs do not rewrite what was already recorded.”

## 5. Attach PreStocks context (~25 seconds)

**Do:** Click **PreStocks reference** in the review header (opens `/prestocks?opportunity=opp_demo_lumen`). On **OpenAI PreStocks**, click **Use as reference for Lumen Harbor Analytics**, then **Back to Lumen Harbor Analytics** (or **Return to review workspace**).

**Do:** Scroll to **PreStocks market reference** and the **Labeled comparison** table.

**Say:** “Lumen has no matching PreStocks row. Attaching OpenAI is optional context. It is not evidence and it does not change R01–R05. Token exposure is not share ownership.”

## 6. Close (~15 seconds)

**Say:** “VERIQ makes claim-versus-entered-evidence checks repeatable, and it can sit a live PreStocks catalog next to those claims without turning a token price into a verdict.”

**Stop.**
