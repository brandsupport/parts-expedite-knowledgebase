# Parts Expedite Knowledge Base

A standalone amber-themed front-end preview for the Parts Expedite team.

## Source files

The frontend is committed as normal, browsable project files:

- `index.html` — application shell and page metadata.
- `css/app.css` — complete responsive amber / graphite design system.
- `js/app.js` — frontend navigation, article catalogue, forms, profile and browser-local preview interactions.
- `assets/parts-expedite-mark.svg` — team identity mark.
- `assets/parts-doodle-background.svg` — automotive-parts doodle wallpaper.
- `assets/favicon.svg`, `assets/apple-touch-icon.svg` and `site.webmanifest` — browser and installed-app icons.
- `avatars/*.svg` — original superhero profile portraits.
- `.github/workflows/pages.yml` — source validation and GitHub Pages deployment.

## Front-end preview scope

- Responsive Parts Expedite knowledge library, categories, article reader and search.
- Built-in article submission and edit layouts.
- Member, Authorized Editor and Administrator preview modes.
- Admin review panels, revision history, recycle-bin, notifications and user-management layouts.
- Profile, superhero avatar selection and favorites.
- Four reserved game cards; game design is intentionally deferred.

## GitHub Pages

The Pages workflow validates the individual HTML, CSS, JavaScript and asset files, creates a static deployment artifact, then deploys it to GitHub Pages.

To enable deployment for this repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.

## Backend phase and preview limitations

This is a static frontend prototype. Its accounts, role switcher, submissions, approvals, revisions, favorites and admin controls are browser-local demonstrations only. They do not provide authentication, permissions, durable storage or cross-user data. The separate Cloudflare Workers + D1 backend will provide those capabilities in the backend phase.

**Do not enter real passwords, personal data or confidential operational information into this prototype.**
