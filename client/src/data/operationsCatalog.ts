/**
 * THE ARZENS operations catalog: every entry uses an official primary route, a conservative free-entry
 * claim, and an explicit review label. “Reviewed” is release research, never live service monitoring.
 */
export type OperationsCategory = "Intern Operations";

export type OperationKind =
  | "Email"
  | "Monitoring"
  | "Authentication"
  | "Storage"
  | "Automation"
  | "Design & CTF";

export type OperationResource = {
  name: string;
  category: OperationsCategory;
  kind: OperationKind;
  tag: string;
  freeType: "Always free" | "Free quota" | "Free credits" | "No card" | "Free access" | "Check live";
  summary: string;
  note: string;
  url: string;
  audience: "Developer" | "Cyber student" | "CTF organizer" | "Student" | "Everyone";
  level: "Start" | "Build" | "Practice" | "Operate";
  reviewed: string;
  recommendation?: boolean;
};

export type OperationMission = "Portfolio & website" | "Full-stack prototype" | "API & webhook" | "AI-assisted delivery" | "Authorized CTF";

export type OperationMissionPlan = {
  mission: OperationMission;
  outcome: string;
  deploymentNote: string;
  resourceNames: string[];
};

export const operationsResources: OperationResource[] = [
  {
    name: "Resend",
    category: "Intern Operations",
    kind: "Email",
    tag: "Transactional email API",
    freeType: "Free quota",
    summary: "Developer-first transactional email with API and SMTP delivery for confirmations, password resets, and app notifications.",
    note: "Official free plan lists 3,000 emails per month with a 100-per-day limit. Use a verified sending domain before a public launch.",
    url: "https://resend.com/pricing",
    audience: "Developer",
    level: "Build",
    reviewed: "Official plan reviewed · 21 Aug 2026",
    recommendation: true,
  },
  {
    name: "Brevo",
    category: "Intern Operations",
    kind: "Email",
    tag: "No-card email route",
    freeType: "No card",
    summary: "Transactional email platform with API, SMTP, templates, and webhook support for small product notifications.",
    note: "The official pricing page offers a free-forever, no-credit-card route. Confirm the current daily sending allowance in the live account before relying on it.",
    url: "https://www.brevo.com/pricing/",
    audience: "Developer",
    level: "Build",
    reviewed: "Official plan reviewed · 21 Aug 2026",
  },
  {
    name: "Better Stack Uptime",
    category: "Intern Operations",
    kind: "Monitoring",
    tag: "API and website watch",
    freeType: "Free quota",
    summary: "Uptime monitors, heartbeats, and a public status page for an intern website, API, or scheduled job.",
    note: "Official free entry lists 10 monitors, 10 heartbeats, one status page, and three-minute checks. Monitor only services you own or are authorized to operate.",
    url: "https://betterstack.com/uptime",
    audience: "Everyone",
    level: "Operate",
    reviewed: "Official plan reviewed · 21 Aug 2026",
    recommendation: true,
  },
  {
    name: "UptimeRobot",
    category: "Intern Operations",
    kind: "Monitoring",
    tag: "Simple availability checks",
    freeType: "No card",
    summary: "A lightweight uptime-monitoring route for public websites and endpoints with email or integration alerts.",
    note: "The official free plan lists 50 monitors at five-minute checks. Review its commercial-use and alerting terms for the exact project.",
    url: "https://uptimerobot.com/pricing/",
    audience: "Everyone",
    level: "Operate",
    reviewed: "Official plan reviewed · 21 Aug 2026",
  },
  {
    name: "Clerk",
    category: "Intern Operations",
    kind: "Authentication",
    tag: "Prebuilt sign-in",
    freeType: "No card",
    summary: "User management and prebuilt authentication UI for a prototype that needs secure sign-in without building auth screens from zero.",
    note: "Official Hobby entry is no-card and lists broad starter capacity. Read current limits, especially before using it for a public event.",
    url: "https://clerk.com/pricing",
    audience: "Developer",
    level: "Build",
    reviewed: "Official plan reviewed · 21 Aug 2026",
    recommendation: true,
  },
  {
    name: "Supabase Auth",
    category: "Intern Operations",
    kind: "Authentication",
    tag: "Auth beside Postgres",
    freeType: "Free quota",
    summary: "Authentication, social OAuth, MFA options, and user data alongside the Supabase database and storage platform.",
    note: "The free plan is useful for a starter app, but inactive projects can pause after one week. Keep exports and a restart plan.",
    url: "https://supabase.com/pricing",
    audience: "Developer",
    level: "Build",
    reviewed: "Official plan reviewed · 21 Aug 2026",
  },
  {
    name: "Cloudinary",
    category: "Intern Operations",
    kind: "Storage",
    tag: "App media delivery",
    freeType: "No card",
    summary: "Image and video upload, transformation, CDN delivery, and media APIs for projects that need visual assets.",
    note: "The free tier is credit-based. It is app media infrastructure, not a replacement for personal-file backup.",
    url: "https://cloudinary.com/pricing",
    audience: "Developer",
    level: "Build",
    reviewed: "Official plan reviewed · 21 Aug 2026",
    recommendation: true,
  },
  {
    name: "GitHub Actions",
    category: "Intern Operations",
    kind: "Automation",
    tag: "CI/CD workflow runner",
    freeType: "Free quota",
    summary: "Automate tests, builds, deployment checks, and scheduled maintenance directly from a GitHub repository.",
    note: "Public repositories use standard GitHub-hosted runners at no cost; private repositories have monthly included minutes and storage. Check usage before enabling billing.",
    url: "https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions",
    audience: "Developer",
    level: "Operate",
    reviewed: "Official plan reviewed · 21 Aug 2026",
    recommendation: true,
  },
  {
    name: "GitHub Projects",
    category: "Intern Operations",
    kind: "Automation",
    tag: "Work tracking",
    freeType: "Free access",
    summary: "Plan features, bugs, and delivery tasks beside code using GitHub’s built-in project views and issues.",
    note: "Use it to make an internship build visible: one board, clear issues, linked pull requests, and a short delivery log.",
    url: "https://github.com/features/issues",
    audience: "Everyone",
    level: "Start",
    reviewed: "Official product route reviewed · 21 Aug 2026",
  },
  {
    name: "Penpot",
    category: "Intern Operations",
    kind: "Design & CTF",
    tag: "Open design collaboration",
    freeType: "Free access",
    summary: "An open-source browser design platform for wireframes, responsive prototypes, design systems, and developer handoff.",
    note: "The official site offers free browser signup and a self-host route. Use it to document the product before writing the interface.",
    url: "https://penpot.app/",
    audience: "Everyone",
    level: "Start",
    reviewed: "Official product route reviewed · 21 Aug 2026",
  },
  {
    name: "CTFd Core",
    category: "Intern Operations",
    kind: "Design & CTF",
    tag: "Authorized event platform",
    freeType: "Free access",
    summary: "The open-source CTFd core can run a scoreboard and challenge workflow for an authorized team event.",
    note: "The managed CTFd service is paid. Self-hosting is free software, but you remain responsible for isolation, updates, backups, rules, and legal authorization.",
    url: "https://ctfd.io/pricing/",
    audience: "CTF organizer",
    level: "Operate",
    reviewed: "Official product route reviewed · 21 Aug 2026",
    recommendation: true,
  },
  {
    name: "CTFtime for Organizers",
    category: "Intern Operations",
    kind: "Design & CTF",
    tag: "Event discovery listing",
    freeType: "Free access",
    summary: "Submit public, team-based CTF event details so participants can discover an authorized competition.",
    note: "Have clear English event details, timing, format, organizers, and a working site ready. Follow the platform’s organizer rules.",
    url: "https://ctftime.org/for-organizers/",
    audience: "CTF organizer",
    level: "Operate",
    reviewed: "Official organizer route reviewed · 21 Aug 2026",
  },
];

export const operationMissions: OperationMissionPlan[] = [
  {
    mission: "Portfolio & website",
    outcome: "Turn a project into a public, credible portfolio surface with a basic delivery routine.",
    deploymentNote: "Pick a frontend route in Ship Your Project Free, then use these tools to plan, automate, and observe the public result.",
    resourceNames: ["Penpot", "GitHub Projects", "GitHub Actions", "Better Stack Uptime"],
  },
  {
    mission: "Full-stack prototype",
    outcome: "Add sign-in, app media, email notifications, and a small operational safety net around a working product.",
    deploymentNote: "Pair this with a database-backed deployment stack. Keep secrets server-side and check free-tier pause behavior before a demo.",
    resourceNames: ["Clerk", "Resend", "Cloudinary", "Better Stack Uptime"],
  },
  {
    mission: "API & webhook",
    outcome: "Ship an API or webhook receiver that can notify users and reveal whether the public endpoint is still responding.",
    deploymentNote: "Choose a backend route from the deployment board, commit the code to Git, and monitor only the endpoint you operate.",
    resourceNames: ["Resend", "UptimeRobot", "GitHub Actions", "GitHub Projects"],
  },
  {
    mission: "AI-assisted delivery",
    outcome: "Use AI for a focused build sprint while preserving a human-owned plan, source control, test routine, and live handoff.",
    deploymentNote: "Select an AI builder in Ship Your Project Free, then keep architecture decisions, secrets, testing, and final review under your control.",
    resourceNames: ["Penpot", "GitHub Projects", "GitHub Actions", "Better Stack Uptime"],
  },
  {
    mission: "Authorized CTF",
    outcome: "Prepare a lawful team event with an isolated control plane, public rules, a backup plan, and only intentionally vulnerable targets.",
    deploymentNote: "Choose an isolated server route first. Do not run challenges against systems you do not own or have written permission to test.",
    resourceNames: ["CTFd Core", "UptimeRobot", "GitHub Projects", "CTFtime for Organizers"],
  },
];

export const pakistanProtocol = [
  { code: "PK-01", title: "Use your real identity", detail: "Enter your own legal name, email, and phone number. Never borrow an identity, card, student record, or phone verification." },
  { code: "PK-02", title: "Prefer a no-card route first", detail: "Start with no-card or free-quota providers where they fit. If a provider asks for a card, read the charge, trial, and deletion rules before continuing." },
  { code: "PK-03", title: "Treat eligibility as a requirement", detail: "Country availability, phone codes, student status, capacity, and payment support are provider decisions. Do not try to bypass any restriction." },
  { code: "PK-04", title: "Protect the project", detail: "Keep code in Git, use environment variables for secrets, add a backup, and record a fallback route before a quota or inactivity rule can interrupt your demo." },
];
