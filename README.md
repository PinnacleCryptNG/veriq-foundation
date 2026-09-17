# VERIQ

Private-market opportunity verification workspace. Reviewers will compare deal claims against submitted evidence and surface conflicts, missing materials, open questions, evidence-supported findings, and verification limits.

This repository currently includes the application shell plus a **local demo intake**: create opportunities, inspect detail pages, and attach evidence metadata. It does not run verification, authenticate documents, or determine investment safety.

Submitted documents do not establish legal ownership, issuer approval, document authenticity, or investment safety.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- Lucide icons
- Zod for intake and storage validation

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

Other commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Workspace overview and opportunity queue |
| `/opportunities` | Seeded demo records plus locally created opportunities |
| `/opportunities/new` | Working intake form |
| `/opportunities/[id]` | Opportunity detail and evidence records |

## Local persistence

Opportunities and evidence metadata are stored in the browser’s `localStorage` under `veriq.opportunities.v1`.

This is **demo-only**. It is not secure production storage, is limited to this device and browser, can be cleared by the user or the browser, and is subject to size limits. Seeded demo records live in `src/data/demo-opportunities.ts` and are merged in without overwriting user-created records.

Attachments at or under 256 KB may be stored as local data URLs for preview. Larger files, or files that cannot be read, keep metadata only. File presence does not prove authenticity or ownership.

## What is not included

- Authentication
- Backend or database
- External APIs or AI calls
- Automated verification findings
- Payments
- The verification engine
