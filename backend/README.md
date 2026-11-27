# Parts Expedite live workspace — Cloudflare setup

The production app is a **single-origin Cloudflare Worker**. The Worker serves the same static frontend and the `/api/*` endpoints, so its secure HttpOnly session cookie stays first-party. D1 stores accounts, roles, articles, submissions, revisions, favorites and notifications. R2 stores private screenshots and future article attachments.

The GitHub Pages site remains a read-only frontend preview. Do not use the Pages URL for live sign-in. Live accounts work on the Worker URL after deployment.

## 1. Create the Cloudflare resources

Sign in to the Cloudflare account that will own Parts Expedite and create:

- D1 database: `parts-expedite-db`
- R2 bucket: `parts-expedite-media`

Or use Wrangler from the repository root:

```bash
npm install
npx wrangler login
npx wrangler d1 create parts-expedite-db
npx wrangler r2 bucket create parts-expedite-media
```

Copy the D1 `database_id` returned by Cloudflare into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`. Keep the R2 bucket private; do not enable public bucket access.

## 2. Prepare GitHub Actions access

Create a Cloudflare API token scoped to the account that owns the Worker, with permission to deploy Workers and manage the D1 database and R2 objects. In the GitHub repository open **Settings → Secrets and variables → Actions** and add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Never commit either value to the repository or paste a token into a chat.

## 3. Deploy the database and Worker with sign-in still disabled

Open **Actions → Deploy Parts Expedite live Cloudflare Worker → Run workflow**.

For the first run, keep:
- **Apply pending D1 migrations:** enabled
- **Enable account authentication:** disabled

The workflow validates the source, extracts the 58 AVIF source screenshots, applies the ordered migrations (including the 30 imported articles and 60 screenshot references), uploads the private R2 objects and deploys the app/API together.

The first deployment uses `AUTH_ENABLED=false`. The registration and login endpoints remain disabled until the first administrator is created.

## 4. Bootstrap the first administrator

After the first Worker deployment, set a long, random one-time Worker secret named `BOOTSTRAP_ADMIN_SECRET` in **Cloudflare Dashboard → Workers & Pages → parts-expedite-api → Settings → Variables and Secrets** (mark it as a secret).

Use the Worker `workers.dev` address shown by Cloudflare after deployment. Send a one-time bootstrap request from your own terminal, substituting your own email and name. The password is created locally by you and must not be added to GitHub or shared in chat:

```bash
curl -X POST "https://YOUR-WORKER.workers.dev/api/admin/bootstrap" \
  -H "Content-Type: application/json" \
  -H "X-Bootstrap-Key: YOUR_ONE_TIME_SECRET" \
  --data '{"email":"YOUR_WORK_EMAIL","displayName":"Your Name","password":"A_NEW_PASSWORD_OF_AT_LEAST_12_CHARACTERS"}'
```

A successful response confirms that the initial Administrator account was created. The bootstrap endpoint refuses to create another administrator once one already exists.

Immediately delete `BOOTSTRAP_ADMIN_SECRET` from Worker secrets after the bootstrap succeeds.

## 5. Turn on real accounts

Run the Cloudflare deployment workflow again with:
- **Apply pending D1 migrations:** disabled
- **Enable account authentication:** enabled

That deploys `AUTH_ENABLED=true`. Only after this step do registration, login, password recovery and account management become available.

The initial Administrator can approve pending Member registrations and grant/revoke the separate Authorized Editor capability. Members submit articles and edit suggestions for review; Authorized Editors and Administrators can publish directly. Temporary passwords require a forced password change at the next sign-in.

## Source screenshots and private media

The source archive is `data/parts-expedite-article-images.zip`. It contains 58 unique AVIF files used by 60 references across 19 articles.

The Cloudflare deployment workflow extracts the archive and runs `scripts/upload-source-images.sh` to place the AVIF objects in the private R2 bucket under `source-articles/`. D1's `0003_seed_source_images.sql` migration links those objects to the imported articles. The Worker serves them through `/api/media/:imageId` after checking visibility; it does not expose the bucket.

New article screenshots are validated and stored privately. Screenshots added by a Member stay attached to their pending submission until an administrator approves it, at which point the Worker moves the media references into the published article.

## Local checks

```bash
npm run check
npm run build
npm run db:status:remote
```

To inspect or apply migrations manually:

```bash
npm run db:migrate:remote
```

## Important operational notes

- Password recovery creates an in-app request and notifies administrators. This setup does not yet send password-reset emails; an email provider and delivery configuration would be a separate addition.
- Keep `AUTH_ENABLED=false` until the first Administrator has been bootstrapped and the one-time bootstrap secret has been removed.
- The public GitHub Pages deployment is only a preview. Use the Cloudflare Worker URL for live account tests.
- Take D1 backups and review account/role access periodically.
