# THE ARZENS Secure Vercel Dashboard Migration Notes

## Verified target context

The connected Vercel team is **Arzens** (`team_QWAjhDjm6gp0ARRESk2gDF4G`) on the Hobby plan. At assessment time, it had no linked Vercel projects.

## Supported deployment shape

Vercel supports an Express application exported as the default export of a serverless function entry point. The existing Express router will be extracted into a reusable app factory and exposed through an API function, while the Vite-built client is served as the public dashboard interface.[1]

The dashboard uses client-side routing, so Vercel must preserve a single-page-application deep-link fallback for non-API routes such as `/admin`.[2]

## Security boundary

The Vercel project must receive these values through **Vercel Project Settings**, never through Git, browser code, documentation, or chat attachments:

| Category | Required variable names |
|---|---|
| Session and owner access | `JWT_SECRET`, `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GITHUB_OAUTH_ALLOWED_LOGIN` |
| Database | `DATABASE_URL` |
| GitHub catalog publisher | `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY` |

`GITHUB_OAUTH_CLIENT_SECRET`, `JWT_SECRET`, `DATABASE_URL`, and `GITHUB_APP_PRIVATE_KEY` are server-only. They must never be committed, printed, or prefixed with `VITE_`. The standalone GitHub owner-login does not require Manus OAuth values or `VITE_APP_ID`.

The existing Manus dashboard stays active until a Vercel deployment passes owner authentication, repository catalog access, and a controlled publication check. The public GitHub Pages Launchpad remains unchanged throughout this migration.

## Current Vercel account prerequisite

The Vercel account has a GitHub login connection, but Vercel reported that its **Vercel GitHub App** must also be installed before it can link `Arzen-007/thearzens-intern-launchpad`. The official GitHub App configuration page is open in the owner browser at <https://github.com/apps/vercel>.

Install or configure the Vercel GitHub App for **only** the `Arzen-007/thearzens-intern-launchpad` repository. Do not grant access to unrelated repositories. Once complete, retry Vercel Git project creation.

## Project creation status

After the Vercel GitHub App was granted repository-only access, Vercel's project-creation API returned a provisional project ID but could not verify the Git link; direct project inspection and the Vercel project inventory both returned no project. No usable Vercel project or deployment exists from that API attempt.

The owner browser's Vercel **New Project** screen now lists `thearzens-intern-launchpad` under the `Arzen-007` GitHub account with an **Import** control. This is the safe manual fallback: import that repository once, then configure the project before deployment. The existing Manus dashboard remains the active fallback.

The manual import configuration now confirms the `Arzens` Hobby team, source repository `Arzen-007/thearzens-intern-launchpad` on `main`, Vite application preset, and project-root directory (`./`). Before the Create Project action, use the Vercel project name `thearzens-owner-dashboard` and add required environment values through Vercel's secure Environment Variables panel only.

The Vercel project has since been created as `thearzens-owner-dashboard` and is linked to `Arzen-007/thearzens-intern-launchpad` on `main`. Its generated production URL is `https://thearzens-owner-dashboard.vercel.app`. The first project deployment used `pnpm install --frozen-lockfile`, `pnpm build:vercel`, and `dist/public` without changing the public GitHub Pages Launchpad or the Manus fallback.

GitHub Developer Settings confirms that the owner account currently has no OAuth Apps. The dedicated dashboard-only OAuth App must use the Vercel URL above and the exact callback URL `https://thearzens-owner-dashboard.vercel.app/api/oauth/github/callback`. It must stay separate from the repository publishing GitHub App.

On 25 August 2026, the dedicated `THE ARZENS Owner Dashboard` GitHub OAuth App was created with the required Vercel homepage and callback URL. Wildcard redirect matching and Device Flow remain disabled. Its client secret was rotated after an exposure event and the obsolete secret was revoked; the current value is present only as a masked Vercel Production secret and is not recorded here.

## Neon connection status

The Neon connector is shown as enabled in account configuration, but the session's Neon MCP endpoint repeatedly reports `server not found` after a connection refresh. The migration must not create, query, or change any database until the Neon service is discoverable in this session. The existing Manus database has not been accessed or modified.

Browser verification on 25 August 2026 confirms the owner is authenticated in the Neon Console at `https://console.neon.tech/app/org-winter-water-76076562/projects`. The organisation is on the Free plan and currently has **no Neon projects**, so creating a new database there will be isolated by default and cannot affect an existing Neon workload. The Neon browser console is usable even though the Neon MCP endpoint remains unavailable.

## Isolated database provisioned

On 25 August 2026, a new Neon project named `thearzens-owner-dashboard` was created through the authenticated owner browser. It is separate from the existing Manus database and uses the Neon Free plan, PostgreSQL 18, the default `production` branch, and AWS Asia Pacific 1 (Singapore). Neon Auth remains disabled because the dashboard is planned to use a dedicated GitHub OAuth owner-login flow. The Neon connection string has not been copied into this document, the repository, or chat.

The isolated Vercel project is `thearzens-owner-dashboard` in the `Arzens` team. Its Production-only private `DATABASE_URL` points to this newly created, isolated Neon project. The database role password and Vercel connection value were rotated after an exposure event, followed by a successful Vercel Production redeployment. The non-secret Production configuration values `VITE_AUTH_PROVIDER=github` and `DATABASE_PROVIDER=neon` are present. No database connection value, OAuth credential, GitHub App credential, or session secret is recorded in this repository.

## Independent session validation

The dedicated GitHub owner-login now signs its sessions with a stable, non-secret dashboard audience, rather than requiring Manus `VITE_APP_ID`. The retained Manus fallback still uses its own configuration. Type-checking, 19 tests, the production build, and the Vercel-mode build passed after this change.

## Neon schema verification

On 25 August 2026, the prepared `user_role` enum and `users` table were applied through the SQL Editor of the isolated Neon `production` branch. A read-only metadata query returned `true` for both the `users` table and `user_role` enum. The check did not read, write, or disclose any owner rows or connection information.

## Vercel serverless loading fix

The first production owner-login probe showed an `ERR_MODULE_NOT_FOUND` error at the Vercel function entry because Node ESM could not resolve the extensionless `server/app` import. The function entry and its runtime dependency chain now use explicit `.js` ESM import paths. The first patch exposed a second Vercel runtime constraint: TypeScript-only `@shared/*` aliases are not resolved by the Node function runtime, so active server imports now use explicit relative ESM paths too. A regression assertion protects the function entry contract; type-checking, all 19 tests, the production build, and the Vercel-mode build pass. The patched production routes were then verified through the independent owner login.

## Legacy OAuth isolation

The first independent owner-login probe also showed that loading the session SDK eagerly initialized the retained Manus OAuth client and emitted an unnecessary missing-configuration warning. The SDK now initializes that client only when a legacy Manus OAuth method is called. GitHub owner sessions use a local signed cookie and Neon persistence without Manus OAuth settings. The focused regression test, type-checking, all 20 tests, the production build, and the Vercel-mode build pass. Post-deployment Vercel logs confirm the independent start route and callback complete without the legacy OAuth warning.

## Neon owner-role preservation

The first successful GitHub callback created the intended owner session, but routine session refresh was writing Neon’s default `user` role back over the existing `admin` role. The Neon conflict-update path now updates `role` only when a callback explicitly supplies one; normal `lastSignedIn` refreshes preserve the existing access level. Two focused regression tests cover both cases. Type-checking, all 22 tests, the production build, and the Vercel-mode build pass. The final Vercel owner-login test reached `/admin` with admin access.

## Production owner-login verification

The final Vercel Production deployment became Ready on 25 August 2026. The dedicated, allow-listed GitHub owner login completed and the browser reached the protected THE ARZENS `/admin` control room, proving the signed independent session and isolated Neon persistence path work in production. No publisher operation was performed.

The GitHub App publisher settings are now present as Vercel Production-only values. During the first entry attempt the existing private key appeared in a tool preview, so it was immediately revoked and replaced before use. The replacement remains a masked server-only Vercel secret and is not recorded in this repository. Manus stays active as the fallback.

Vercel runtime logs for the latest deployment show the owner-login start route returning `302`, the GitHub callback returning `302`, followed by `auth.me` and the protected catalog/status queries returning `200`. The log panel reports zero current warnings, errors, and fatal events; the old Manus OAuth configuration warning is absent from this post-deployment sequence.

## Publisher and Pages read-only verification

After the final Vercel Production redeployment, the authenticated THE ARZENS control room reports **GitHub Publisher: Connected** and **Pages Publication: Live**. It reads one active GitHub-managed resource record and identifies it as included in the Pages bundle; the latest Pages workflow is reported live. This is a successful read-only verification only. No Vercel-originated catalog mutation, repository commit, or public Launchpad change has been made since the migration started.

Vercel runtime logs independently confirm the read-only check: authenticated `catalog.status`, `catalog.list`, and `catalog.deployment` requests returned HTTP `200` after the replacement-key deployment, and the log panel showed zero warnings, errors, and fatal events.

## Controlled publication verification

On 25 August 2026, the owner approved one reversible Vercel-only test change. From the authenticated Vercel THE ARZENS owner control room, the existing managed `github-pages-static-hosting` record had only its Pakistan / operational note updated to: “Vercel owner control check — managed record verified after independent dashboard migration.” The dashboard returned a successful GitHub commit receipt for `5e2d811d08f8aeb1fbb00bbe428b10d50b63d242`; read-only commit metadata confirms the sole modified file was `client/src/data/managedResources.json` and the commit message was `catalog: update GitHub Pages`.[3]

The resulting GitHub Pages workflow run `32856440450` completed successfully against that exact commit and deployed to the existing public Launchpad URL.[4] The live production bundle contains the approved note and the `THE ARZENS OWNER CATALOG` card-source label. A pre-existing static GitHub Pages card remains intentionally separate; the dashboard-managed record is appended as the clearly labelled owner-catalog card, preserving the public core catalog while making owner changes traceable. A final live visual inspection of that appended card remains tracked separately because the browser inspection timed out while searching the exceptionally long public page.

## References

[1]: https://vercel.com/docs/frameworks/backend/express "Vercel: Express"
[2]: https://vercel.com/docs/frameworks/frontend/vite "Vercel: Vite"
[3]: https://github.com/Arzen-007/thearzens-intern-launchpad/commit/5e2d811d08f8aeb1fbb00bbe428b10d50b63d242 "GitHub commit 5e2d811"
[4]: https://github.com/Arzen-007/thearzens-intern-launchpad/actions/runs/32856440450 "GitHub Pages workflow run 32856440450"
