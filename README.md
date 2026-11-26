# Parts Expedite Knowledge Base

Standalone amber-themed front-end preview for the Parts Expedite team.

## GitHub Pages preview

The site is deployed from the `main` branch using `.github/workflows/pages.yml`. The workflow extracts the static source archive, validates its core assets, JavaScript syntax and web-app manifest, then deploys the result to GitHub Pages.

## Source layout

- `site-source.tar.gz` — source archive unpacked by the Pages workflow.
- `.github/workflows/pages.yml` — static-site validation and GitHub Pages deployment.

The archive contains:

- `index.html`
- `css/app.css`
- `js/app.js`
- `site.webmanifest`
- `assets/*.svg` — Parts Expedite brand mark, automotive doodle wallpaper and shared browser/touch icons
- `avatars/*.svg` — original superhero profile portraits

## Front-end scope

- Amber / graphite automotive identity, neon styling and hand-drawn parts pattern.
- Responsive knowledge library, categories, article reader and search.
- Built-in article submission and edit flows with member / Authorized Editor / Administrator preview modes.
- Front-end admin queue, review cards, revisions, recycle bin, user and notification screens.
- Profile, superhero avatar selection and favorites.
- Four reserved game cards; game design is intentionally deferred.

## Backend phase

This first deployment is a static front-end prototype and uses browser-local demonstration state only. Authentication, role enforcement, article submissions, approval workflows, revisions, favorites and persistent user data will be implemented in a separate Cloudflare Workers + D1 backend. The preview role switcher is for design review only and provides no security.

**Do not enter real passwords, personal data or confidential operational information into this prototype.** No real user accounts, shared D1 data or cross-user submissions exist yet.
