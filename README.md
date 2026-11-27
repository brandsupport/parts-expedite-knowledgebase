# Parts Expedite Knowledge Base

A responsive knowledge workspace for the Parts Expedite team, with the original imported guide library, screenshot references, knowledge games placeholders and a Cloudflare-backed live account/publishing workflow.

## Frontend files

- `index.html` — application shell.
- `css/app.css` — responsive amber / graphite design system and supplied automotive-parts doodle background.
- `js/app.js` — navigation, library, article reader, account forms, profile, admin workspace and publishing workflow.
- `data/articles-*.js` — 30 imported source articles.
- `data/article-images.js` — 60 screenshot references across 19 guides, pointing to 58 unique AVIF files.
- `data/parts-expedite-article-images.zip` — original AVIF screenshot archive used by the build and Cloudflare deployment.
- `backend/worker.js` and `backend/migrations/` — Cloudflare Worker API and ordered D1 schema/data migrations.
- `assets/parts-doodle-background.svg` — the exact parts doodle artwork supplied for the site background.
- `avatars/*.svg` — original Parts Expedite profile portraits.

## Preview site

The GitHub Pages workflow validates the source and publishes a static preview:

https://brandsupport.github.io/parts-expedite-knowledgebase/

This preview uses embedded image assets and does not provide cross-user authentication or shared database storage. Do not use it for live account tests.

## Live workspace

The production app is served by the Cloudflare Worker from the same origin as its API. It uses:

- **D1:** accounts, roles, sessions, articles, review submissions, revisions, favorites and notifications.
- **R2:** private source screenshots and uploaded article images.
- **Worker:** secure session authentication, role checks, account approvals, Authorized Editor grants, publishing review and protected image delivery.

Follow [backend/README.md](backend/README.md) for the Cloudflare resource setup, GitHub Actions secrets, first-admin bootstrap and safe authentication activation sequence.

The Cloudflare deployment workflow is manual:
**Actions → Deploy Parts Expedite live Cloudflare Worker**.

Sign-in is deliberately disabled until an initial Administrator has been created and the one-time bootstrap secret has been removed.

## Quality checks

```bash
npm install
npm run check
npm run build
```

The GitHub Pages workflow also validates the 30 imported articles, 60 image references, 58 unique AVIF files and the SQLite-compatible migration chain.
