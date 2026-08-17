# Ship Your Project Free — Official Research Notes

## Frontend and full-stack deployment

| Provider | Official source | Verified current information | Use in the launchpad |
| --- | --- | --- | --- |
| Cloudflare Pages | https://pages.cloudflare.com/ | Free plan lists unlimited sites, unlimited static requests and bandwidth, 500 builds per month, one concurrent build, and up to 100 custom domains per project. Cloudflare documents GitHub/GitLab integration and Pages Functions through Workers. | Strong default for static portfolios, documentation, and frontend applications. |
| Vercel Hobby | https://vercel.com/pricing | $0 Hobby plan is positioned for personal web applications/projects. The pricing page currently states 100 GB/month fast data transfer, 1M edge requests/month, 1M function invocations/month, and 4 active CPU hours/month. | Use for personal/student frontend or framework projects; do not present it as an unrestricted team/commercial deployment route. |
| Netlify Free | https://www.netlify.com/pricing/ | $0 plan lists a 300-credit limit, deploys from AI/Git/API, custom domains with SSL, deploy previews, Functions, database, blob storage, and global CDN. Production deploys cost 15 credits; usage can exhaust credits. | Good integrated student stack, but clearly disclose credit-based limits. |
| Koyeb | https://www.koyeb.com/pricing | Current public pricing emphasizes paid compute and a temporary free 5-hour Postgres instance. It should not be labelled as an always-free general backend host without checking live account eligibility. | Mention only as a check-live/credits option, not a primary free backend recommendation. |

## Backend runtimes, servers, and databases

| Provider | Official source | Verified current information | Use in the launchpad |
| --- | --- | --- | --- |
| Cloudflare Workers | https://developers.cloudflare.com/workers/platform/pricing/ | The default Free plan currently includes 100,000 requests/day and 10 ms CPU time per invocation. Pages Functions use Workers billing. | Best for small APIs, webhooks, edge logic, and lightweight full-stack features; not a persistent Node/Docker server. |
| Oracle Cloud Free Tier | https://www.oracle.com/cloud/free/ | Oracle offers a 30-day US$300 trial in select countries and Always Free services that continue if the user does not upgrade. The FAQ lists AMD and Arm compute among Always Free services. Signup needs a credit/debit card that works like a credit card; capacity can be unavailable and accounts can be suspended after 30 idle days. | Strong route for a student who genuinely needs a Linux VM; present the card, availability, and idle-account warnings prominently. |
| Neon | https://neon.tech/pricing | Permanent, no-card Free plan with 100 CU-hours/project, 0.5 GB storage/project, 5 GB public egress, 10 branches, and scale-to-zero after five minutes. Limits suspend compute until the following month. | Recommended Postgres database for prototypes and API-backed apps. |
| Supabase | https://supabase.com/pricing | Free plan lists 500 MB Postgres, 1 GB file storage, 5 GB egress, 50,000 MAU, and two active projects. Free projects pause after one week of inactivity. | Good first integrated stack for database, auth, files, and API, provided interns expect a wake-up after idle time. |

## Domains, subdomains, and AI support

| Provider | Official source | Verified current information | Use in the launchpad |
| --- | --- | --- | --- |
| GitHub Student Developer Pack | https://education.github.com/pack | The Pack’s current offers include free GitHub Pro while a student, a Namecheap `.me` registration for one year, selected Name.com domains, one `.TECH` domain for one year, and Azure student access. Offers require verified student status and can change. | First route for eligible students who want a proper custom domain or student cloud credits. |
| EU.org | https://nic.eu.org/ | EU.org provides free subdomain registration to individuals and non-profit organizations, but is a subdomain service, not a paid TLD registrar; it offers no support and requests can require manual review. | Use only when a free, controlled subdomain is acceptable and a learner can wait; do not call it a free top-level domain. |
| Google AI Studio / Gemini Developer API | https://aistudio.google.com | Google’s current developer-pricing documentation states that developers can start free with limited model access and free input/output tokens for eligible free-tier models. Free-tier content may be used to improve Google products; quotas and availability vary by model/region. | Use for prototyping an AI feature or working with Gemini in the browser; label it quota-based, not an unlimited production API. |
| Kimi | https://www.kimi.com/ | Public web interface with availability and model limits that can vary by account and region. The web interface should be presented as a research/coding assistant, not as a dedicated hosting environment. | Good assistant for planning, writing, analysis, and code review; always confirm live limits at signup. |
| Qwen Chat | https://chat.qwen.ai/ | Public browser chat environment with availability and feature limits controlled by the provider. | Good assistant for code explanations, drafting, and research; not a substitute for a persistent backend runtime. |
