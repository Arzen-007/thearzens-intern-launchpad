# THE ARZENS Operations Expansion — Verified Research Notes

## Transactional Email

| Provider | Official route | Verified free-entry detail | Catalog guidance |
| --- | --- | --- | --- |
| Resend | https://resend.com/pricing | Free plan lists 3,000 transactional emails per month with a 100-per-day limit; API and SMTP are included. | Good developer-first email route for password resets, confirmations, and app notifications. Display both volume limits. |
| Brevo | https://www.brevo.com/pricing/ | The official pricing page presents a free-forever, no-credit-card entry route and confirms transactional-email features, including APIs, SMTP, and outbound webhooks. | Good no-card alternative; label the daily sending allowance as something to confirm in the live account/help center. |
| Mailjet | https://www.mailjet.com/solutions/use-cases/transactional-email/ | Official transactional-email page confirms signup, API/SMTP integration, templates, tracking, and event webhooks. | Include only as an alternative; show free-tier allowance as “check live” unless a current official allowance page is added. |

## Evidence captured

- Resend pricing and documentation were opened on 2026-08-21.
- Brevo official pricing was opened on 2026-08-21.
- All external cards will label free access honestly and link only to official provider pages.

## Monitoring and Status Pages

| Provider | Official route | Verified free-entry detail | Catalog guidance |
| --- | --- | --- | --- |
| Better Stack Uptime | https://betterstack.com/uptime | Official page advertises 10 monitors, 10 heartbeats, one status page, and 3-minute checks at no cost. | Recommended monitoring route for an intern API, website, or scheduled job. |
| UptimeRobot | https://uptimerobot.com/pricing/ | Official pricing lists a no-card free plan with 50 monitors and 5-minute checks, suitable for hobby and non-profit projects. | Include the commercial-use wording and free-check interval in the operational note. |
| Pulsetic | https://pulsetic.com/ | Official home page advertises a free-forever plan with 10 monitors, three custom-domain status pages, and no card. | Useful alternative for a small public project that needs a visible status page. |

## Monitoring evidence captured

- Better Stack, UptimeRobot, and Pulsetic official pages were extracted on 2026-08-21.
- UptimeRobot’s official API page also confirms API access and 50 free monitors with 5-minute checks; catalog cards will link to the clear public pricing page instead of assuming continuous live availability.

## Authentication and User Management

| Provider | Official route | Verified free-entry detail | Catalog guidance |
| --- | --- | --- | --- |
| Clerk | https://clerk.com/pricing | Hobby is free with no card; the page lists unlimited apps, up to 3 dashboard seats, and up to 50,000 monthly retained users per app. | Recommended when an intern wants prebuilt sign-in UI and user management. |
| Supabase Auth | https://supabase.com/pricing | Free plan lists 50,000 MAUs, social OAuth, basic MFA, custom SMTP, 500 MB database, and 1 GB storage. Free projects pause after one week of inactivity and are limited to two active projects. | Recommended for a data-backed app; pause behavior must remain visible. |
| Auth0 | https://auth0.com/pricing | Official plan lists a no-card free route up to 25,000 MAUs with passwordless authentication and social connections. | Include as a strong alternative but keep the card concise because feature availability can vary by use case. |

## Authentication evidence captured

- Clerk and Supabase official pricing pages were opened on 2026-08-21.
- The most user-facing card copy will focus on Clerk and Supabase; Auth0 will remain an alternate route for teams that need its identity model.

## Media Storage and CI/CD

| Provider | Official route | Verified free-entry detail | Catalog guidance |
| --- | --- | --- | --- |
| Cloudinary | https://cloudinary.com/pricing | Free-forever, no-card image/video API tier with 25 monthly credits; includes upload/API, transformations, delivery, and CDN features. | Use for project image/video uploads, not generic backup storage. Explain credit-based usage. |
| GitHub Actions | https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions | Standard GitHub-hosted runners are free for public repositories. GitHub Free includes 2,000 monthly CI/CD minutes and 500 MB shared artifact/package storage for private repositories. | Recommended automation route. Warn users that extra private-repository usage can be billed when a payment method is present. |
| GitHub Free | https://github.com/pricing | $0 plan has unlimited public and private repositories, Issues & Projects, and the documented CI/CD allowance. | Use as the primary code-to-deploy control plane. |

## Storage and CI/CD evidence captured

- Cloudinary and GitHub official plan pages were extracted on 2026-08-21.
- The UI should clearly distinguish storage used by an app from simple personal-file backup.

## Design and Authorized CTF Operations

| Provider | Official route | Verified free-entry detail | Catalog guidance |
| --- | --- | --- | --- |
| Penpot | https://penpot.app/ | Official site presents Penpot as an open-source collaborative design platform and offers a free browser sign-up plus a self-host install route. | Recommended for wireframes, prototypes, design systems, and developer handoff. |
| CTFd Core | https://ctfd.io/pricing/ | Official FAQ states the open-source CTFd core can be self-hosted at no cost, while CTFd’s managed hosting is paid. | Include only as an authorized-event deployment route; present self-hosting as a responsibility, not a zero-effort hosted service. |
| CTFtime organizers | https://ctftime.org/for-organizers/ | Organizers can submit an English-language event listing with event, timing, format, organizer, site, and other details. The site is for team competitions. | Add as a free promotion/discovery route once an authorized team event has public details. |

## Design and CTF evidence captured

- Penpot and CTFd official pages were opened on 2026-08-21.
- CTFd cards will distinguish its no-cost open-source core from paid hosted plans, and all CTF copy will retain the existing authorized, legal-practice framing.
