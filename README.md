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
- **Knowledge Graph** (`/knowledge-graph`) — interactive pan/zoom graph with entity side panels
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

## Deploying to Cloudflare Pages

This is a static single-page app — no server runtime is required.

### Option A — Git integration (recommended)

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and select
   this repository.
2. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Deploy. Every push to the connected branch redeploys automatically.

`public/_redirects` (`/* /index.html 200`) is included so client-side routes (e.g.
`/opportunities/opp-nia`) resolve correctly on refresh/deep-link instead of 404ing.

### Option B — Wrangler CLI

```sh
npm install -g wrangler   # or use npx
npm run build
npx wrangler pages deploy dist --project-name presales-intelligence-prototype
```

`wrangler.toml` at the repo root already points at `dist` as the Pages build output directory.
