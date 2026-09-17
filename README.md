# VERIQ

Private-market opportunity verification workspace. Reviewers will compare deal claims against submitted evidence and surface conflicts, missing materials, open questions, evidence-supported findings, and verification limits.

This repository is the **project foundation**: application shell, navigation, and labeled demo data. It does not run verification, authenticate documents, or determine investment safety.

Submitted documents do not establish legal ownership, issuer approval, document authenticity, or investment safety.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- Lucide icons
- Zod (schemas ready for later validation)

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
| `/` | Workspace overview and demo queue |
| `/opportunities` | Labeled demo opportunity list |
| `/opportunities/new` | Placeholder for the future intake flow |

## What is not included

- Authentication
- Database or file storage
- External APIs or AI calls
- Payments
- The verification engine

Demo records live in `src/data/demo-opportunities.ts` and are marked as demo in the UI.
