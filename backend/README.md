# Parts Expedite Knowledge Base — Cloudflare Pages

Parts Expedite uses the same hosting architecture as the VWG Brand Support Knowledge Base:

- **Cloudflare Pages** serves the generated website from `dist/`.
- **Pages Functions** handles the `/api/*` routes through `functions/api/[[path]].js`.
- **Cloudflare D1** stores articles, accounts, submissions, approvals and image uploads.
- Original article screenshots remain in the Git repository and are embedded into the static build.
- New screenshot uploads are stored as Base64 data in D1.

There is no separate Worker deployment, no R2 bucket and no separate media service.

## 1. Create the Cloudflare Pages project

In Cloudflare, choose **Workers & Pages → Create application → Pages → Connect to Git**. Do not configure this repository under Workers Builds.

Connect `brandsupport/parts-expedite-knowledgebase` on branch `main`.

Use these settings:

| Setting | Value |
|---|---|
| Project name | `parts-expedite-kb` |
| Production branch | `main` |
| Framework preset | None |
| Root directory | `/` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Pages Git integration performs the deployment after the build. There is no separate Deploy command in this setup. The optional manual deployment command, when needed from a terminal, is `npm run deploy`.

## 2. D1 binding

The existing production D1 database is retained:

- Name: `parts-expedite-db`
- Binding: `DB`
- Database ID: `614c9444-160b-4db1-a061-5661185e7cef`

The D1 binding and `AUTH_ENABLED` variable are configured in the root `wrangler.jsonc` Pages configuration. Keep this file as the source of truth for Pages Functions settings.

## 3. Database migrations

The database has already been initialised by the GitHub Actions workflow **Apply Parts Expedite D1 migrations**. The four ordered migrations create the schema, import the library and image references, and add account/publishing features.

To check migration status locally after authenticating Wrangler:

```bash
npm run db:status:remote
```

The workflow uses the repository Actions secrets `CLOUDFLARE_API_TOKEN` (D1 Edit) and `CLOUDFLARE_ACCOUNT_ID`.

## 4. Accounts and publishing

Authentication is enabled in `wrangler.jsonc`. Once the Pages site is deployed and its `/api/health` endpoint confirms the D1 connection, register the first account using **Request access**.

The first registration is pending by design. Promote only that first account to Administrator in the D1 Console using its exact registered email:

```sql
UPDATE users
SET role = 'admin',
    status = 'active',
    approved_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'YOUR_WORK_EMAIL' COLLATE NOCASE;
```

Confirm one row changed, then sign in. New registrations remain pending Member accounts. Administrators approve users and manage Authorized Editor access.

## 5. Screenshots and article publishing

The existing 58 AVIF screenshots and 60 article references across 19 guides stay in the repository. `scripts/build-static.mjs` embeds the source files into the generated site.

New screenshot uploads use the no-bucket approach: JPEG, PNG, WebP and AVIF files are validated and stored as Base64 data in D1. Each file is limited to 270 KB, with up to 8 screenshots and 900 KB total per contribution.

Member screenshots remain attached to pending submissions and move to published article records only when an administrator approves the contribution.

## Local checks

```bash
npm install
npm run check
npm run build
npm run dev
npm run db:status:remote
```

For a manual Pages deployment after authenticating Wrangler:

```bash
npm run deploy
```

The normal production path is Cloudflare Pages Git integration, which automatically builds and deploys pushes to `main`.
