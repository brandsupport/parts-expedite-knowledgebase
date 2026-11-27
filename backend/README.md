# Parts Expedite live workspace — Brand Support-aligned Cloudflare Pages setup

The production platform follows the **same deployment architecture as the Brand Support Knowledge Base**:

- Cloudflare Pages serves the built website.
- Cloudflare Pages Functions handle the same-origin `/api/*` routes.
- Cloudflare D1 stores accounts, sessions, approvals, submissions, revisions, favorites and notifications.
- Article screenshots stay in the Git repository and are embedded into the static build as Base64 data URIs.

**There is no R2 bucket, no separate production Worker, no MEDIA binding, and no image-upload service dependency.**

The API route adapter in `functions/api/[[path]].js` forwards the same-origin API requests to the existing Parts API handler. The browser uses the Pages hostname for both the site and API, preserving secure HttpOnly session cookies.

## 1. Connect the repository to Cloudflare Pages

In Cloudflare:

1. Open **Workers & Pages → Create application → Pages → Connect to Git**.
2. Select the GitHub repository `brandsupport/parts-expedite-knowledgebase`.
3. Use project name `parts-expedite-kb` and production branch `main`.
4. Set the build command to `npm run build`.
5. Set the build output directory to `dist`.
6. Set the root directory to `/` and start the first deployment.

Cloudflare Pages automatically discovers the repository's `functions/` directory. The root `wrangler.jsonc` is the source of truth for the Pages project and contains the D1 binding.

## 2. Apply the D1 migrations

The existing D1 database is:

- Name: `parts-expedite-db`
- Binding: `DB`
- Database ID: `614c9444-160b-4db1-a061-5661185e7cef`

The manual GitHub Actions workflow **Apply Parts Expedite D1 migrations** applies the ordered SQL files from `backend/migrations/` to that database. It requires repository Actions secrets:

- `CLOUDFLARE_API_TOKEN` — account-scoped token with **D1 Edit** permission.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID.

Do not add Workers Scripts Write or R2 permissions. Never commit either secret or paste the API token into chat.

Run the workflow after the Pages project has been created and its first build is complete. It applies the 30 imported articles, category records and account/publishing schema. The 58 original AVIF files are handled by the static build; the database only keeps their metadata references.

## 3. Enable account registration

The initial Pages configuration deliberately sets `AUTH_ENABLED=false`. After the migrations succeed:

1. Change `AUTH_ENABLED` to `true` in `wrangler.jsonc` and commit the change.
2. Wait for Cloudflare Pages to deploy the new commit.
3. Open the live Pages URL and use **Request access** to register your own work account.
4. In the Cloudflare D1 Console, promote only that first account to Administrator using its exact email:

```sql
UPDATE users
SET role = 'admin',
    status = 'active',
    approved_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'YOUR_WORK_EMAIL' COLLATE NOCASE;
```

5. Confirm the SQL reports one changed row, then sign in.

New registrations remain pending Member accounts. Administrators approve them and may grant or revoke Authorized Editor access. Authorized Editors and Administrators can publish directly; Member submissions and edits enter the review queue.

## 4. Screenshot and article publishing model

The existing 58 AVIF screenshots and 60 article references across 19 guides stay in `data/article_images/` and `data/article-images.js`. `scripts/build-static.mjs` embeds the source files into `data/article-images.js` in the generated site. The original archive and source images are not duplicated into the published `dist` output.

New screenshot uploads use the same no-bucket approach: the API validates JPEG, PNG, WebP and AVIF files, limits each file to 270 KB and stores the Base64 image data in D1. Member screenshots remain attached to pending submissions and move to the published article records only when an administrator approves the contribution.

## Local checks

```bash
npm install
npm run check
npm run build
npm run db:status:remote
```

For local Pages Functions development, use `npm run dev`. D1 migrations can be applied from the repository root with `npm run db:migrate:remote` once Wrangler is authenticated.

## Operational notes

- Password recovery is administrator-mediated; no email delivery provider is configured yet.
- GitHub Pages remains a read-only preview. Use the Cloudflare Pages hostname for live sign-in.
- Keep D1 production data backed up and periodically review Administrator and Authorized Editor access.
