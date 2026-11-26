# Parts Expedite Knowledge Base

Standalone amber-themed front-end preview for the Parts Expedite team. This first deployment is static and uses browser-local demonstration state only. Authentication, role enforcement, article submissions, approval workflows, revisions, favorites and persistence will be connected to a separate Cloudflare Workers + D1 backend in the next phase.

## GitHub Pages preview

The site deploys from the repository root using `.github/workflows/pages.yml`.

## Local preview

Open `index.html` in a browser or serve this folder with any static HTTP server.

## Front-end scope

- Amber / graphite automotive identity, neon styling and parts-doodle background.
- Responsive knowledge library, categories, article reader and search.
- Submission and edit flows with member / authorized-editor / administrator preview modes.
- Local preview admin queue, revision history, recycle bin, profile and favorites.
- Superhero avatar SVGs and shared favicon / touch icon references.
- Four reserved game cards; game design is intentionally deferred.

## Important

This is a UI prototype. The role switcher is for design review only and provides no security. Do not enter real passwords or confidential information. No real user accounts, D1 data, or cross-user submissions exist until the backend phase is configured.