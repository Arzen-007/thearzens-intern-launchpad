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
| Session and owner access | `JWT_SECRET`, `OWNER_OPEN_ID`, `OWNER_NAME` |
| Database | `DATABASE_URL` |
| Manus OAuth compatibility | `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` |
| GitHub catalog publisher | `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY` |

`GITHUB_APP_PRIVATE_KEY` is server-only. It must never be committed, printed, or prefixed with `VITE_`.

The existing Manus dashboard stays active until a Vercel deployment passes owner authentication, repository catalog access, and a controlled publication check. The public GitHub Pages Launchpad remains unchanged throughout this migration.

## Current Vercel account prerequisite

The Vercel account has a GitHub login connection, but Vercel reported that its **Vercel GitHub App** must also be installed before it can link `Arzen-007/thearzens-intern-launchpad`. The official GitHub App configuration page is open in the owner browser at <https://github.com/apps/vercel>.

Install or configure the Vercel GitHub App for **only** the `Arzen-007/thearzens-intern-launchpad` repository. Do not grant access to unrelated repositories. Once complete, retry Vercel Git project creation.

## Project creation status

After the Vercel GitHub App was granted repository-only access, Vercel's project-creation API returned a provisional project ID but could not verify the Git link; direct project inspection and the Vercel project inventory both returned no project. No usable Vercel project or deployment exists from that API attempt.

The owner browser's Vercel **New Project** screen now lists `thearzens-intern-launchpad` under the `Arzen-007` GitHub account with an **Import** control. This is the safe manual fallback: import that repository once, then configure the project before deployment. The existing Manus dashboard remains the active fallback.

The manual import configuration now confirms the `Arzens` Hobby team, source repository `Arzen-007/thearzens-intern-launchpad` on `main`, Vite application preset, and project-root directory (`./`). Before the Create Project action, use the Vercel project name `thearzens-owner-dashboard` and add required environment values through Vercel's secure Environment Variables panel only.

## Neon connection status

The Neon connector is shown as enabled in account configuration, but the session's Neon MCP endpoint repeatedly reports `server not found` after a connection refresh. The migration must not create, query, or change any database until the Neon service is discoverable in this session. The existing Manus database has not been accessed or modified.

Browser verification on 25 August 2026 confirms the owner is authenticated in the Neon Console at `https://console.neon.tech/app/org-winter-water-76076562/projects`. The organisation is on the Free plan and currently has **no Neon projects**, so creating a new database there will be isolated by default and cannot affect an existing Neon workload. The Neon browser console is usable even though the Neon MCP endpoint remains unavailable.

## Isolated database provisioned

On 25 August 2026, a new Neon project named `thearzens-owner-dashboard` was created through the authenticated owner browser. It is separate from the existing Manus database and uses the Neon Free plan, PostgreSQL 18, the default `production` branch, and AWS Asia Pacific 1 (Singapore). Neon Auth remains disabled because the dashboard is planned to use a dedicated GitHub OAuth owner-login flow. The Neon connection string has not been copied into this document, the repository, or chat.

## References

[1]: https://vercel.com/docs/frameworks/backend/express "Vercel: Express"
[2]: https://vercel.com/docs/frameworks/frontend/vite "Vercel: Vite"
