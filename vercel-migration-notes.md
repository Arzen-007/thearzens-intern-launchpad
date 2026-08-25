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

## References

[1]: https://vercel.com/docs/frameworks/backend/express "Vercel: Express"
[2]: https://vercel.com/docs/frameworks/frontend/vite "Vercel: Vite"
