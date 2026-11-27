# Parts Expedite Knowledge Base

A responsive knowledge workspace for the Parts Expedite team, with the imported guide library, screenshot references, knowledge games and a shared account/publishing workflow.

## Hosting architecture

The live site follows the same Cloudflare architecture as the VWG Brand Support Knowledge Base:

- **Cloudflare Pages** serves the generated website from `dist/`.
- **Pages Functions** handles the same-origin `/api/*` routes through `functions/api/[[path]].js`.
- **Cloudflare D1** stores articles, accounts, roles, sessions, review submissions, revisions, favorites and notifications.
- Original article screenshots remain in the Git repository and are embedded into the static build.
- New screenshot uploads are stored as Base64 data in D1.

There is no separate Worker deployment, no R2 bucket and no separate media service.

## Repository map

- `index.html` — application shell.
- `css/app.css` — responsive amber / graphite design system and automotive-parts doodle background.
- `js/app.js` — navigation, library, article reader, account forms, profile, admin workspace and publishing workflow.
- `data/articles-*.js` — 30 imported source articles.
- `data/article-images.js` — 60 screenshot references across 19 guides, pointing to 58 unique AVIF files.
- `data/parts-expedite-article-images.zip` — original AVIF screenshot archive used by the static build.
- `functions/api/[[path]].js` — Cloudflare Pages Functions API adapter.
- `backend/worker.js` — shared API handler used by the Pages Function adapter.
- `backend/migrations/` — ordered D1 schema and seed migrations.
- `wrangler.jsonc` — Pages build output and D1 binding.
- `assets/parts-doodle-background.svg` — supplied Parts Expedite background artwork.
- `avatars/*.svg` — Parts Expedite profile portraits.

## Cloudflare Pages deployment

Connect `brandsupport/parts-expedite-knowledgebase` to a **Cloudflare Pages** project using Git integration. Use:

| Setting | Value |
|---|---|
| Project name | `parts-expedite-kb` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | `/` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Pages Git integration builds and deploys commits automatically; it does not use the mandatory Workers Builds Deploy command. Do not connect this repository as a Workers Build.

The root Wrangler configuration supplies the `DB` binding and `AUTH_ENABLED` variable to Pages Functions. The existing D1 database and its completed migrations are retained.

See [backend/README.md](backend/README.md) for deployment, D1 and first-administrator setup.

## GitHub Pages preview

The GitHub Pages workflow publishes a static preview:

https://brandsupport.github.io/parts-expedite-knowledgebase/

This preview is read-only and does not provide cross-user authentication or shared database storage. Use the Cloudflare Pages site for the live workspace and account tests.

## Quality checks

```bash
npm install
npm run check
npm run build
```

The GitHub Actions preview workflow also validates the 30 imported articles, 60 image references, 58 unique AVIF files and SQLite-compatible migration chain.
