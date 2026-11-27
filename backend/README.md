# Parts Expedite live workspace — Cloudflare Workers Builds

The live workspace is deployed as **one Cloudflare Worker with Static Assets and D1**. This matches the mandatory Deploy command workflow in Workers Builds and keeps the website and API on the same origin.

- The Worker entry point is `backend/worker.js`.
- Cloudflare Static Assets serves the generated website from `dist/` through the `ASSETS` binding.
- Worker API routes use the `DB` binding to the existing D1 database.
- Original article screenshots are embedded into the static build from repository files.
- New screenshot uploads are stored as Base64 data in D1.

**No R2 bucket, separate media service, or separate Pages deployment is required.**

The root `wrangler.jsonc` is the source of truth. It configures the Worker entry point, Static Assets, D1 binding and runtime variables. The Worker uses `env.ASSETS.fetch(request)` for non-API requests and handles `/api/*` requests itself.

## 1. Configure Cloudflare Workers Builds

In Cloudflare, connect the GitHub repository `brandsupport/parts-expedite-knowledgebase` to the Worker `parts-expedite-kb`. In **Settings → Builds**, use:

| Setting | Value |
|---|---|
| Root directory | `/` |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |
| Production branch | `main` |

The Deploy command is required in Workers Builds. The `npm run deploy` script runs:

```bash
wrangler deploy --config wrangler.jsonc
```

The build command creates `dist/`; Wrangler then deploys `backend/worker.js` and uploads that directory as Worker Static Assets. Do not use `wrangler pages deploy` for this Worker deployment.

## 2. D1 database and migrations

The existing D1 database is:

- Name: `parts-expedite-db`
- Binding: `DB`
- Database ID: `614c9444-160b-4db1-a061-5661185e7cef`

The manual GitHub Actions workflow **Apply Parts Expedite D1 migrations** applies the ordered SQL files from `backend/migrations/` to this database. It requires repository Actions secrets:

- `CLOUDFLARE_API_TOKEN` — account-scoped token with **D1 Edit** permission.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID.

Workers Builds must also have permission to deploy the Worker and bind the existing D1 database. Never commit either secret or paste the API token into chat. No R2 permissions or bucket are required.

Run the migration workflow after the first successful Worker deployment. It applies the imported articles, categories and account/publishing schema. The original AVIF files are handled by the static build; the database keeps image metadata references.

## 3. Enable account registration

The initial Wrangler configuration deliberately sets `AUTH_ENABLED=false`. After the migrations succeed:

1. Change `AUTH_ENABLED` to `true` in `wrangler.jsonc` and commit the change.
2. Workers Builds will rebuild and redeploy the Worker.
3. Open the live Worker URL and use **Request access** to register your own work account.
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

The existing 58 AVIF screenshots and 60 article references across 19 guides stay in the Git repository. `scripts/build-static.mjs` embeds the source files into the generated site. The original archive and source images are not duplicated as remote media objects.

New screenshot uploads use the same no-bucket approach: the API validates JPEG, PNG, WebP and AVIF files, limits each file to 270 KB and stores the Base64 image data in D1. Member screenshots remain attached to pending submissions and move to the published article records only when an administrator approves the contribution.

Limits are 8 screenshots per contribution, 270 KB each and 900 KB total.

## Local checks

```bash
npm install
npm run check
npm run build
npm run dev
npm run db:status:remote
```

To deploy manually after authenticating Wrangler, use `npm run deploy`. D1 migrations can be applied from the repository root with `npm run db:migrate:remote`.

## Operational notes

- Password recovery is administrator-mediated; no email delivery provider is configured yet.
- GitHub Pages remains a read-only static preview. Use the Cloudflare Worker URL for live sign-in.
- Keep D1 production data backed up and periodically review Administrator and Authorized Editor access.
