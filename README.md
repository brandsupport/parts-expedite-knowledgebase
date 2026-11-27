# Parts Expedite Knowledge Base

A responsive knowledge workspace for the Parts Expedite team, with the original imported guide library, screenshot references, knowledge games placeholders and a Cloudflare-backed live account/publishing workflow.

## Frontend and backend

- `index.html` — application shell.
- `css/app.css` — responsive amber / graphite design system and supplied automotive-parts doodle background.
- `js/app.js` — navigation, library, article reader, account forms, profile, admin workspace and publishing workflow.
- `data/articles-*.js` — 30 imported source articles.
- `data/article-images.js` — 60 screenshot references across 19 guides, pointing to 58 unique AVIF files.
- `data/parts-expedite-article-images.zip` — original AVIF screenshot archive used by the static build.
- `backend/worker.js` and `backend/migrations/` — Cloudflare Worker API and ordered D1 schema/data migrations.
- `wrangler.jsonc` — Worker entry point, Static Assets configuration and D1 binding.
- `assets/parts-doodle-background.svg` — the exact parts doodle artwork supplied for the site background.
- `avatars/*.svg` — original Parts Expedite profile portraits.

## Preview site

The GitHub Pages workflow validates the source and publishes a static preview:

https://brandsupport.github.io/parts-expedite-knowledgebase/

This preview uses embedded image assets and does not provide cross-user authentication or shared database storage. Do not use it for live account tests.

## Live workspace

The production app is deployed as **one Cloudflare Worker with Static Assets and D1**. The Worker serves the website and same-origin API; D1 stores accounts, roles, sessions, articles, review submissions, revisions, favorites and notifications.

Article screenshots are embedded in the static build from repository files. New screenshots are stored as Base64 data in D1. **No R2 bucket or separate media service is required.**

Follow [backend/README.md](backend/README.md) for the Cloudflare Workers Builds settings, D1 migrations, first-administrator setup and authentication activation sequence.

Workers Builds uses:
- Build command: `npm run build`
- Required Deploy command: `npm run deploy`

## Quality checks

```bash
npm install
npm run check
npm run build
```

The GitHub Pages workflow also validates the 30 imported articles, 60 image references, 58 unique AVIF files and the SQLite-compatible migration chain.
