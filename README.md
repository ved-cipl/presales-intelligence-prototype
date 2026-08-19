# Presales Intelligence

A clickable, enterprise-grade prototype of an AI-powered Presales Intelligence System — built to
communicate a vision where every new opportunity becomes a structured, evidence-backed
intelligence object that a Qualification Agent (and, eventually, Trend, Solution, Proposal,
Account Intelligence and Knowledge agents) all operate on.

This is a standalone client-side React app. All data is mock/local (`src/features/presales/data`)
— there is no backend, no auth, and nothing to configure to run it.

## Screens

- **Overview** (`/dashboard`) — KPI cards, an opportunity attention map, AI recommendations
- **Opportunities** (`/opportunities`) — filterable/sortable portfolio table
- **New Opportunity** (`/opportunities/new`) — intake flow with a simulated AI extraction pipeline
- **Opportunity Intelligence** (`/opportunities/:id`) — qualification scorecard, evidence,
  similar opportunities, knowledge graph, activity timeline, decision history
- **Evidence Explorer** (`/opportunities/:id/evidence`)
- **Knowledge Graph** (`/knowledge-graph`) — force-directed graph (opportunities, clients,
  industries, capabilities, technologies, case studies, practices, people) with search-to-focus,
  type filters, hover/click highlighting and entity side panels
- **Intelligence** (`/intelligence`) — trends, market map, AI workforce, architecture
- **Qualification Standards** (`/qualification`) — editable organizational scoring framework
- **Solutions / Knowledge / Settings** — Coming Soon placeholders

## Development

```sh
npm install
npm run dev
```

Other scripts: `npm run build` (production build to `dist/`), `npm run preview` (serve the build
locally), `npm run typecheck`.

## Deploying to Cloudflare

This is a static single-page app — deployed as a Cloudflare **Worker with static assets** (no
server runtime code required; `wrangler.toml` has no `main` entry, so it's purely an assets
deployment). `not_found_handling = "single-page-application"` in `wrangler.toml` makes client-side
routes (e.g. `/opportunities/opp-nia`) resolve correctly on refresh/deep-link instead of 404ing.

### Option A — Git integration (recommended)

1. In the Cloudflare dashboard: **Workers & Pages → Create**, then connect this repository.
2. Build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
3. Deploy. Every push to the connected branch redeploys automatically.

### Option B — Wrangler CLI

```sh
npm install
npm run build
npx wrangler deploy
```
