# Parts Expedite Cloudflare backend

This project uses a single-origin Cloudflare Worker for the app and API, D1 for relational data, and a **private** R2 bucket for screenshots and uploaded article images.

## Services

- **Worker:** serves the static app and the `/api/*` routes from the same origin.
- **D1:** users, account status, roles, sessions, categories, articles, tags, review submissions, revisions, image metadata, notifications and audit records.
- **R2:** screenshots extracted from the source PDF and future article uploads. The bucket is not made public; the Worker streams images after checking article visibility.

## First-time Cloudflare setup

Run these commands from the repository root after connecting your Cloudflare account:

```bash
npm install
npx wrangler login
npx wrangler d1 create parts-expedite-db
npx wrangler r2 bucket create parts-expedite-media
```

Copy the D1 database ID returned by Wrangler into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`.

Apply the schema and imported article library:

```bash
npm run db:migrate:remote
npm run db:status:remote
```

Create a long random one-time bootstrap secret in your password manager, then set it:

```bash
npx wrangler secret put BOOTSTRAP_ADMIN_SECRET
```

Build and deploy the Worker:

```bash
npm run deploy
```

The Worker will report a `workers.dev` URL. The app and API will share that host so the session cookie is first-party and HttpOnly.

## Create the first administrator

Call the one-time bootstrap route with the same secret you set above. Use your own email and choose a strong password; do not put a password into this repository.

```bash
curl -X POST "https://YOUR-WORKER.workers.dev/api/admin/bootstrap" \
  -H "Content-Type: application/json" \
  -H "X-Bootstrap-Key: YOUR_ONE_TIME_SECRET" \
  --data '{"email":"YOUR_WORK_EMAIL","displayName":"Your Name","password":"A_NEW_LONG_PASSWORD"}'
```

After the first administrator is created, immediately remove the bootstrap secret:

```bash
npx wrangler secret delete BOOTSTRAP_ADMIN_SECRET
```

Registrations create pending Member accounts. An Admin activates accounts and can grant Authorized Editor access. New articles and edit suggestions from Members enter the review queue. Authorized Editors can publish directly. The Worker enforces these rules server-side.

## Source screenshots

The companion archive `parts-expedite-source-images.zip` contains 60 WebP screenshot references for 19 articles, plus a manifest with article IDs, PDF page numbers, alt text and captions.

1. Extract the ZIP into `backend/seed/source-images/`.
2. Upload the files to the private R2 bucket:

```bash
bash scripts/upload-source-images.sh
```

The D1 image-reference migration links those R2 object keys to the relevant imported articles. The UI will display the screenshots through `/api/media/:imageId`, not a public bucket URL.

## API outline

- `GET /api/health`, `GET /api/categories`
- `GET /api/articles`, `GET /api/articles/:id-or-slug`
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/admin/bootstrap` (one-time only)
- `POST /api/articles`, `PUT /api/articles/:id`
- `GET /api/admin/users`, `PATCH /api/admin/users/:id`
- `GET /api/admin/submissions`, `PATCH /api/admin/submissions/:id`
- `POST /api/articles/:id/images`, `GET /api/media/:imageId`

## Deliberate next steps

- Connect the current front-end forms and screens to this API (the static GitHub Pages preview still uses local browser state).
- Configure a transactional email provider before enabling password reset emails and outbound notifications.
- Add a production domain after the API and first administrator have been tested.
- Add retention, backups and routine access review for D1 and R2.
