/**
 * THE ARZENS design reminder: a dark operational launchpad for interns. Use high-contrast near-black
 * surfaces, electric cyan as the primary signal, sharp technical borders, terminal microcopy, and
 * real supplied brand marks. Red is for CTF / offensive-security context; purple is for AI / research.
 */
import { Fragment, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  CircleAlert,
  CircleCheckBig,
  Cloud,
  Code2,
  Crosshair,
  Database,
  ExternalLink,
  Flag,
  GitBranch,
  GraduationCap,
  Github,
  Globe2,
  HardDrive,
  KeyRound,
  Mail,
  Menu,
  Network,
  Radar,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { expandedResources, type ExpandedCategory } from "@/data/atlasCatalog";
import { projectStacks, shipResources, type ShipCategory, type ShipResource } from "@/data/shipFreeCatalog";
import { operationMissions, operationsResources, pakistanProtocol, type OperationKind, type OperationMission, type OperationResource, type OperationsCategory } from "@/data/operationsCatalog";
import { providerIdentityFor } from "@/data/providerIdentity";
import { activeManagedResources } from "@/data/managedCatalog";
import "@/styles/managedCatalog.css";

type CoreCategory =
  | "Servers"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Domains"
  | "AI Agents";
type Category = CoreCategory | ExpandedCategory | OperationsCategory;

type Resource = {
  name: string;
  category: Category;
  tag: string;
  freeType: "Always free" | "Free quota" | "Free credits" | "No card" | "Free access" | "Check live";
  summary: string;
  note: string;
  url: string;
  recommendation?: boolean;
  audience?: "Developer" | "Cyber student" | "CTF organizer" | "Student" | "Everyone";
  level?: "Start" | "Build" | "Practice" | "Operate";
  managedByDashboard?: boolean;
};

type TechnicalFilter =
  | "All"
  | "Frontend"
  | "Backend"
  | "Servers"
  | "Databases"
  | "Domains"
  | "Subdomains"
  | "Labs"
  | "Operations"
  | "Dev Tools"
  | "Student Benefits"
  | "AI Agents"
  | "Security & CTF";

function isSubdomainRoute(resource: Resource) {
  const routeText = `${resource.name} ${resource.tag} ${resource.summary} ${resource.note}`.toLowerCase();
  return resource.category === "Domains" && /subdomain|hostname|dynamic dns|ddns/.test(routeText);
}

function matchesTechnicalFilter(resource: Resource, filter: TechnicalFilter) {
  if (filter === "All") return true;
  if (filter === "Frontend") return resource.category === "Frontend";
  if (filter === "Backend") return resource.category === "Backend";
  if (filter === "Servers") return resource.category === "Servers";
  if (filter === "Databases") return resource.category === "Databases";
  if (filter === "Domains") return resource.category === "Domains" && !isSubdomainRoute(resource);
  if (filter === "Subdomains") return isSubdomainRoute(resource);
  if (filter === "Labs") return resource.category === "Cyber Labs";
  if (filter === "Operations") return resource.category === "Intern Operations";
  if (filter === "Dev Tools") return resource.category === "Dev Tools";
  if (filter === "Student Benefits") return resource.category === "Learning" || resource.category === "Student Packs";
  if (filter === "AI Agents") return resource.category === "AI Agents";
  return resource.category === "Defense & OSINT" || resource.category === "CTF Operations";
}

const coreResources: Resource[] = [
  {
    name: "Oracle Cloud",
    category: "Servers",
    tag: "Best VM route",
    freeType: "Always free",
    summary: "AMD micro instances or shared Arm capacity for a real Linux server, block storage, and object storage.",
    note: "Card verification, home-region capacity, and idle-reclaim rules apply.",
    url: "https://signup.cloud.oracle.com/",
    recommendation: true,
  },
  {
    name: "Google Cloud",
    category: "Servers",
    tag: "Learning lab",
    freeType: "Free credits",
    summary: "New-user credit plus selected no-cost product quotas, including a small Compute Engine route.",
    note: "Trial credit is temporary; billing verification and regions matter.",
    url: "https://console.cloud.google.com/freetrial",
  },
  {
    name: "AWS Free Tier",
    category: "Servers",
    tag: "Cloud practice",
    freeType: "Free credits",
    summary: "New-user credits and selected monthly free-tier allowances across core cloud services.",
    note: "Monitor billing closely and treat it as a learning or short-event option.",
    url: "https://aws.amazon.com/free/",
  },
  {
    name: "Microsoft Azure",
    category: "Servers",
    tag: "12-month lab",
    freeType: "Free credits",
    summary: "Time-limited credit, selected 12-month services, and a broad set of always-free products.",
    note: "A valid card and phone verification are normally required.",
    url: "https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account",
  },
  {
    name: "IBM Cloud Lite",
    category: "Servers",
    tag: "API learning",
    freeType: "Free quota",
    summary: "A collection of Lite products that can stay available with strict usage limits and inactivity rules.",
    note: "Better for learning APIs and services than for an unrestricted Linux VPS.",
    url: "https://www.ibm.com/products/cloud/free",
  },
  {
    name: "Tencent Cloud",
    category: "Servers",
    tag: "Short trial",
    freeType: "Free credits",
    summary: "Promotional compute and storage trials that can be useful for short demonstrations.",
    note: "New-user, region, and offer rules change frequently.",
    url: "https://www.tencentcloud.com/act/pro/FreeTier",
  },
  {
    name: "Cloudflare Pages",
    category: "Frontend",
    tag: "Best static route",
    freeType: "Free quota",
    summary: "Fast static-site hosting with custom domains, SSL, Git integration, and a generous project/build allowance.",
    note: "Pair it with Workers for lightweight APIs.",
    url: "https://dash.cloudflare.com/sign-up",
    recommendation: true,
  },
  {
    name: "GitHub Pages",
    category: "Frontend",
    tag: "Docs & write-ups",
    freeType: "Free quota",
    summary: "Publish a static site directly from a GitHub repository with a custom-domain option.",
    note: "Static only: no database or server-side runtime.",
    url: "https://pages.github.com/",
  },
  {
    name: "Firebase Hosting",
    category: "Frontend",
    tag: "SPA route",
    freeType: "No card",
    summary: "Static web hosting on the Firebase Spark plan with a path to Firebase authentication and data products.",
    note: "Stay inside Spark limits to avoid needing a paid billing plan.",
    url: "https://console.firebase.google.com/",
  },
  {
    name: "InfinityFree",
    category: "Frontend",
    tag: "PHP shared host",
    freeType: "No card",
    summary: "No-card shared PHP/MySQL hosting with free subdomains and SSL for small learning sites.",
    note: "No root access, Docker, or isolated containers.",
    url: "https://dash.infinityfree.com/register",
  },
  {
    name: "AwardSpace",
    category: "Frontend",
    tag: "PHP starter",
    freeType: "No card",
    summary: "Free shared hosting with PHP/MySQL, a domain/subdomain allowance, and a CMS installer.",
    note: "Best for very small websites, not a public event backend.",
    url: "https://www.awardspace.com/free-web-hosting-registration/",
  },
  {
    name: "Cloudflare Workers",
    category: "Backend",
    tag: "Edge API",
    freeType: "Free quota",
    summary: "Serverless code at the edge for APIs, webhooks, authentication gateways, and rate limiting.",
    note: "This is not SSH, root access, or a general-purpose VM.",
    url: "https://dash.cloudflare.com/sign-up",
    recommendation: true,
  },
  {
    name: "Northflank",
    category: "Backend",
    tag: "Small Docker path",
    freeType: "Free quota",
    summary: "A PaaS route for small services, a database, cron jobs, custom Dockerfiles, and managed domains.",
    note: "Confirm live CPU/RAM limits and fair-use rules before an event.",
    url: "https://app.northflank.com/signup",
  },
  {
    name: "Railway",
    category: "Backend",
    tag: "Tiny demo",
    freeType: "Free credits",
    summary: "Credits-based PaaS for small services, databases, and prototypes with a simple deployment flow.",
    note: "Free credit is small; it is not a dependable lifetime server.",
    url: "https://railway.com/pricing",
  },
  {
    name: "Render",
    category: "Backend",
    tag: "Hobby API",
    freeType: "Free quota",
    summary: "A free web service route for low-traffic APIs, previews, and hobby deployments.",
    note: "Free instances sleep, and their filesystem is ephemeral.",
    url: "https://dashboard.render.com/register",
  },
  {
    name: "PythonAnywhere",
    category: "Backend",
    tag: "Python demo",
    freeType: "Free quota",
    summary: "A beginner-friendly Python web-app host with console access and a small free allowance.",
    note: "Outbound internet and compute are restricted; no Docker or VPS.",
    url: "https://www.pythonanywhere.com/pricing/",
  },
  {
    name: "Vercel",
    category: "Backend",
    tag: "Next.js route",
    freeType: "Free quota",
    summary: "Frontend-first hosting with serverless/edge functions for personal and small project workflows.",
    note: "No general server; check Hobby plan usage limits.",
    url: "https://vercel.com/signup",
  },
  {
    name: "Netlify",
    category: "Backend",
    tag: "Functions route",
    freeType: "Free quota",
    summary: "Static deploys, serverless functions, CDN, custom domains, and previews under a credit model.",
    note: "Builds, functions, bandwidth, and requests can consume credits.",
    url: "https://app.netlify.com/signup",
  },
  {
    name: "Neon",
    category: "Databases",
    tag: "Best Postgres route",
    freeType: "No card",
    summary: "Managed serverless Postgres with a permanent free plan, branching, and scale-to-zero behavior.",
    note: "Small storage/compute limits apply; projects can suspend when quota is reached.",
    url: "https://neon.com/signup",
    recommendation: true,
  },
  {
    name: "Supabase",
    category: "Databases",
    tag: "DB + auth + storage",
    freeType: "Free quota",
    summary: "Postgres, authentication, storage, and generated APIs in a single developer platform.",
    note: "Free projects can pause after inactivity and have project/egress limits.",
    url: "https://supabase.com/dashboard",
  },
  {
    name: "Turso",
    category: "Databases",
    tag: "SQLite at edge",
    freeType: "No card",
    summary: "A libSQL/SQLite database platform with a substantial free plan and many small databases.",
    note: "Test workload compatibility before choosing it over Postgres/MySQL.",
    url: "https://app.turso.tech/signup",
  },
  {
    name: "MongoDB Atlas",
    category: "Databases",
    tag: "Document DB",
    freeType: "Free quota",
    summary: "A small managed MongoDB free cluster for document data, prototypes, and learning.",
    note: "Shared performance and small storage limits apply.",
    url: "https://www.mongodb.com/cloud/atlas/register",
  },
  {
    name: "Cloudflare D1",
    category: "Databases",
    tag: "Workers DB",
    freeType: "Free quota",
    summary: "Serverless SQLite built for Cloudflare Workers, with database and storage limits on the free plan.",
    note: "Not a persistent TCP Postgres/MySQL server.",
    url: "https://dash.cloudflare.com/sign-up",
  },
  {
    name: "Firebase Firestore",
    category: "Databases",
    tag: "Realtime app data",
    freeType: "No card",
    summary: "NoSQL data and real-time app patterns on Firebase’s Spark plan.",
    note: "Daily read/write and transfer limits matter for scoreboards.",
    url: "https://console.firebase.google.com/",
  },
  {
    name: "EU.org",
    category: "Domains",
    tag: "Free subdomain",
    freeType: "Free access",
    summary: "A free subdomain request service for users who can manage their own DNS records.",
    note: "Approval and policy rules apply; this is not a free .com or .pk domain.",
    url: "https://nic.eu.org/",
  },
  {
    name: "is-a.dev",
    category: "Domains",
    tag: "Developer subdomain",
    freeType: "Free access",
    summary: "Community-managed free .is-a.dev subdomain requests through GitHub.",
    note: "Good for portfolios and projects; review and usage policies apply.",
    url: "https://is-a.dev/",
  },
  {
    name: "FreeDNS",
    category: "Domains",
    tag: "DNS & DDNS",
    freeType: "Free access",
    summary: "Free static/dynamic DNS, subdomains, and forwarding for personal and project use.",
    note: "A shared subdomain does not equal owning a registered domain.",
    url: "https://freedns.afraid.org/",
  },
  {
    name: "No-IP",
    category: "Domains",
    tag: "Dynamic DNS",
    freeType: "Free access",
    summary: "A no-cost dynamic DNS hostname for home labs or changing IP addresses.",
    note: "It is a hostname, not a registrar-owned domain; check renewal rules.",
    url: "https://www.noip.com/sign-up",
  },
  {
    name: "Cloudflare DNS",
    category: "Domains",
    tag: "DNS + TLS",
    freeType: "Free quota",
    summary: "Free DNS management, SSL/TLS, DNSSEC, and tight integration with Pages and Workers.",
    note: "You still need a domain or a compatible free subdomain.",
    url: "https://dash.cloudflare.com/sign-up",
  },
  {
    name: "Kimi",
    category: "AI Agents",
    tag: "Agent workspace",
    freeType: "Free access",
    summary: "Web workspace that exposes agent-oriented modes for deep research, documents, websites, sheets, and design.",
    note: "Availability, credits, and task limits may vary by account or region.",
    url: "https://www.kimi.com/",
    recommendation: true,
  },
  {
    name: "Genspark",
    category: "AI Agents",
    tag: "All-in-one agent",
    freeType: "Free access",
    summary: "A web AI workspace spanning chat, research, documents, apps, design, and terminal-oriented tools.",
    note: "The site says try free; model and credit limits can change.",
    url: "https://www.genspark.ai/",
    recommendation: true,
  },
  {
    name: "Google Jules",
    category: "AI Agents",
    tag: "Cloud VM coding agent",
    freeType: "Free quota",
    summary: "Autonomous GitHub coding agent that clones code into a Cloud VM, runs tests, and prepares pull requests.",
    note: "The public plan lists free daily tasks; Google may restrict availability by region.",
    url: "https://jules.google.com/",
    recommendation: true,
  },
  {
    name: "Replit Agent",
    category: "AI Agents",
    tag: "Browser app agent",
    freeType: "Free access",
    summary: "Chat-driven app builder in a browser workspace that can search the web, write code, test with a browser, and deploy.",
    note: "The official site says get started free; live credits and deploy limits apply.",
    url: "https://replit.com/signup",
  },
  {
    name: "Bolt",
    category: "AI Agents",
    tag: "Browser app builder",
    freeType: "Free access",
    summary: "A browser-based AI builder for chatting apps and websites into existence, with testing, backend, and hosting tooling.",
    note: "The official site says start free; usage and model limits are plan-dependent.",
    url: "https://bolt.new/",
  },
  {
    name: "Lovable",
    category: "AI Agents",
    tag: "Full-stack builder",
    freeType: "Free access",
    summary: "Natural-language product builder with browser previews, hosting, infrastructure, and connected services.",
    note: "Free credits and feature access can change; check the live plan before relying on it.",
    url: "https://lovable.dev/",
  },
  {
    name: "Qwen",
    category: "AI Agents",
    tag: "Web model interface",
    freeType: "Free access",
    summary: "A free web model interface for general chat and work, useful alongside agent tools.",
    note: "This research did not verify a persistent sandbox or autonomous agent runtime.",
    url: "https://chat.qwen.ai/",
  },
];

const resources: Resource[] = [...coreResources, ...expandedResources, ...operationsResources, ...activeManagedResources];

const nav = [
  { label: "Initialize", target: "top", number: "00" },
  { label: "Deploy free", target: "deploy-free", number: "01" },
  { label: "Ops desk", target: "ops", number: "02" },
  { label: "Build systems", target: "build", number: "03" },
  { label: "Skill path", target: "learning", number: "04" },
  { label: "Cyber lab", target: "cyber-labs", number: "05" },
  { label: "Tool arsenal", target: "toolkit", number: "06" },
  { label: "Defense ops", target: "defense", number: "07" },
  { label: "AI research", target: "agents", number: "08" },
  { label: "CTF control", target: "ctf", number: "09" },
];

const categoryIcons: Record<Category, typeof Server> = {
  Servers: Server,
  Frontend: Globe2,
  Backend: Network,
  Databases: Database,
  Domains: Cloud,
  "AI Agents": Sparkles,
  Learning: BookOpen,
  "Cyber Labs": Crosshair,
  "Dev Tools": Wrench,
  "Student Packs": GraduationCap,
  "Defense & OSINT": Radar,
  "CTF Operations": ShieldCheck,
  "Intern Operations": Wrench,
};

const categoryNarrative: Record<Category, { eyebrow: string; title: string; copy: string }> = {
  Servers: {
    eyebrow: "01 / Compute",
    title: "The routes that can actually run Linux.",
    copy: "For Docker, CTFd, reverse proxies, and services that need a real server. Oracle is the first route to try; trial clouds are useful for learning and temporary work.",
  },
  Frontend: {
    eyebrow: "02A / Presentation",
    title: "Ship the surface without paying for the surface.",
    copy: "Static frontends, landing pages, docs, write-ups, and project sites belong here. Cloudflare Pages and GitHub Pages are the cleanest starting points.",
  },
  Backend: {
    eyebrow: "02B / Runtime",
    title: "Small runtimes for the services around your app.",
    copy: "Use these for APIs, webhooks, serverless functions, lightweight Docker services, and small Python deployments—not as a promise of permanent free compute.",
  },
  Databases: {
    eyebrow: "03 / Data layer",
    title: "Keep the state where your app can reach it.",
    copy: "Managed databases remove maintenance work but have meaningful free limits. Use a backup routine and test pause/scale-to-zero behavior before an event.",
  },
  Domains: {
    eyebrow: "04 / Naming",
    title: "Free naming is usually a subdomain, not ownership.",
    copy: "Pair a credible free subdomain with Cloudflare DNS and TLS. Treat “free lifetime .com” claims as unreliable unless a live registrar proves them.",
  },
  "AI Agents": {
    eyebrow: "05 / Agent switchboard",
    title: "Web AIs that can take more than one step.",
    copy: "The list separates real coding/agent workspaces from normal web-model interfaces. Free access can mean daily tasks, limited credits, or a no-cost account—not unlimited sandbox time.",
  },
  Learning: {
    eyebrow: "03 / Learn the craft",
    title: "Build a base before chasing every tool.",
    copy: "These routes turn curiosity into practical skill: programming foundations, role maps, documentation, cloud learning, and data practice. Pick one path and finish a project.",
  },
  "Cyber Labs": {
    eyebrow: "04 / Authorized practice",
    title: "Break only what was built to be broken.",
    copy: "Every route here is a lab, challenge platform, or intentionally vulnerable training application. It is for authorized study—not scanning or testing random systems.",
  },
  "Dev Tools": {
    eyebrow: "05 / Build kit",
    title: "Your work needs a home, not just a tutorial.",
    copy: "Use these tools to code, version, test APIs, package containers, and publish visible work. Treat every project like a small professional delivery.",
  },
  "Student Packs": {
    eyebrow: "05A / Student advantages",
    title: "Verify once. Unlock more room to learn.",
    copy: "Student programs can open useful software, credits, and partner offers. Eligibility, country support, and terms vary by provider, so always check the current page.",
  },
  "Defense & OSINT": {
    eyebrow: "06 / Defend & investigate",
    title: "Learn to see systems from the defender’s side.",
    copy: "Build secure habits, understand attacker behavior at a high level, inspect your own traffic, and work from public defensive frameworks—not from unsafe shortcuts.",
  },
  "CTF Operations": {
    eyebrow: "08 / CTF operations",
    title: "Make the event reliable before making it difficult.",
    copy: "A great CTF needs an event layer, backup plan, clear rules, and isolated infrastructure. Use an open platform, then give vulnerable challenges their own restricted environment.",
  },
  "Intern Operations": {
    eyebrow: "02 / Intern operations",
    title: "The layers that keep a project usable after it goes live.",
    copy: "Email, authentication, monitoring, storage, automation, design, and authorized CTF operations help a project work like a real delivery—not only a local demo.",
  },
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function FreeType({ value }: { value: Resource["freeType"] }) {
  const className = value === "Always free" || value === "No card" ? "route-tag route-tag--lime" : value === "Free credits" ? "route-tag route-tag--rust" : "route-tag";
  return <span className={className}>{value}</span>;
}

function faviconFor(url: string) {
  try {
    return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(new URL(url).origin)}&sz=128`;
  } catch {
    return undefined;
  }
}

const arzensLogoSources = {
  cyan: `${import.meta.env.BASE_URL}brand/thearzens-blue.webp`,
  red: `${import.meta.env.BASE_URL}brand/thearzens-red.webp`,
  purple: `${import.meta.env.BASE_URL}brand/thearzens-purple.webp`,
} as const;

function ArzensMark({ tone = "cyan", label }: { tone?: "cyan" | "red" | "purple"; label?: string }) {
  return (
    <img
      className={`arzens-signal arzens-signal--${tone}`}
      src={arzensLogoSources[tone]}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      decoding="async"
    />
  );
}

function ProviderIdentity({ resource }: { resource: Pick<Resource, "name" | "url" | "freeType"> }) {
  const provider = providerIdentityFor(resource);
  const fallback = faviconFor(resource.url);
  const logo = import.meta.env.BASE_URL === "/" ? provider.logo ?? fallback : fallback;
  return (
    <div className="provider-identity">
      <span className="provider-identity__logo" aria-hidden="true">
        {logo ? <img src={logo} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <b>{provider.initials}</b>}
        {!logo && <b>{provider.initials}</b>}
      </span>
      <span className="provider-identity__copy"><b>{provider.organization}</b><small>Official provider</small></span>
      <span className="provider-identity__offer">{provider.offer}</span>
    </div>
  );
}

function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const Icon = categoryIcons[resource.category];
  return (
    <article className={`resource-card ${resource.recommendation ? "resource-card--featured" : ""}`} style={{ "--card-index": index } as React.CSSProperties}>
      <div className="resource-card__topline">
        <div className="resource-card__identity">
          <span className="icon-box"><Icon size={16} strokeWidth={1.8} /></span>
          <span className="resource-card__category">{resource.category}</span>
        </div>
        <FreeType value={resource.freeType} />
      </div>
      <div className="resource-card__content">
        <ProviderIdentity resource={resource} />
        {resource.managedByDashboard && <p className="resource-card__source">THE ARZENS OWNER CATALOG</p>}
        <p className="resource-card__tag">{resource.tag}</p>
        <h3>{resource.name}</h3>
        <p className="resource-card__summary">{resource.summary}</p>
        {(resource.audience || resource.level) && <div className="resource-card__metadata"><span>{resource.audience ?? "Everyone"}</span><i /> <span>{resource.level ?? "Build"}</span></div>}
        <p className="resource-card__note"><CircleAlert size={14} /> {resource.note}</p>
      </div>
      <a className="resource-card__link" href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.name} official website`}>
        <span>Open official route</span>
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

const shipCategoryIcons: Record<ShipCategory, typeof Server> = {
  "Static & frontend": Globe2,
  "Backend & API": Network,
  "Full-stack & data": Database,
  "Servers & compute": Server,
  "Domains & identity": Cloud,
  "Free AI": Sparkles,
};

function ShipResourceCard({ resource, index }: { resource: ShipResource; index: number }) {
  const Icon = shipCategoryIcons[resource.category];
  return (
    <article className={`resource-card ship-resource-card ${resource.recommendation ? "resource-card--featured" : ""}`} style={{ "--card-index": index } as React.CSSProperties}>
      <div className="resource-card__topline">
        <div className="resource-card__identity"><span className="icon-box"><Icon size={16} strokeWidth={1.8} /></span><span>{resource.category}</span></div>
        <FreeType value={resource.freeType} />
      </div>
      <div className="resource-card__content">
        <ProviderIdentity resource={resource} />
        <p className="resource-card__tag">{resource.tag}</p>
        <h3>{resource.name}</h3>
        <p className="resource-card__summary">{resource.summary}</p>
        {(resource.audience || resource.level) && <div className="resource-card__metadata"><span>{resource.audience ?? "Everyone"}</span><i /> <span>{resource.level ?? "Build"}</span></div>}
        <p className="resource-card__note"><CircleAlert size={14} /> {resource.note}</p>
      </div>
      <a className="resource-card__link" href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.name} official website`}><span>Open official route</span><ArrowUpRight size={18} /></a>
    </article>
  );
}

const operationKindIcons: Record<OperationKind, typeof Server> = {
  Email: Mail,
  Monitoring: Radar,
  Authentication: KeyRound,
  Storage: HardDrive,
  Automation: GitBranch,
  "Design & CTF": Flag,
};

function OperationResourceCard({ resource, index, saved, onToggleSaved }: { resource: OperationResource; index: number; saved: boolean; onToggleSaved: (name: string) => void }) {
  const Icon = operationKindIcons[resource.kind];
  return (
    <article className={`operations-card ${resource.recommendation ? "operations-card--featured" : ""}`} style={{ "--card-index": index } as React.CSSProperties}>
      <div className="operations-card__topline">
        <div className="operations-card__identity"><span className="icon-box"><Icon size={16} strokeWidth={1.8} /></span><span>{resource.kind}</span></div>
        <FreeType value={resource.freeType} />
      </div>
      <div className="operations-card__content">
        <ProviderIdentity resource={resource} />
        <p className="operations-card__tag">{resource.tag}</p>
        <h3>{resource.name}</h3>
        <p>{resource.summary}</p>
        <p className="operations-card__note"><CircleAlert size={14} /> {resource.note}</p>
        <div className="operations-card__review"><CircleCheckBig size={13} /> {resource.reviewed}</div>
      </div>
      <div className="operations-card__actions">
        <button onClick={() => onToggleSaved(resource.name)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${resource.name} in your local route tray`}>
          {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {saved ? "Saved" : "Save route"}
        </button>
        <a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.name} official website`}>Open official <ArrowUpRight size={16} /></a>
      </div>
    </article>
  );
}

function CategorySection({ category, id, search }: { category: Category; id: string; search: string }) {
  const content = categoryNarrative[category];
  const gridClass = category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
  const filtered = resources.filter((resource) => {
    const matchedCategory = resource.category === category;
    const haystack = `${resource.name} ${resource.tag} ${resource.summary} ${resource.note}`.toLowerCase();
    return matchedCategory && haystack.includes(search.toLowerCase());
  });
  const lead = filtered.find((resource) => resource.recommendation) ?? filtered[0];

  return (
    <section id={id} className={`atlas-section section-anchor route-${gridClass}`}>
      <div className="section-heading">
        <div className="section-route" aria-hidden="true">
          <span className="section-route__number">{content.eyebrow.split(" /")[0]}</span>
          <i />
          <small>System<br />route</small>
        </div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p>{content.copy}</p>
        {lead && (
          <div className="route-checkpoint">
            <span>Lead route</span>
            <b>{lead.name}</b>
            <p>{lead.tag}</p>
          </div>
        )}
      </div>
      <div className={`resource-grid resource-grid--${gridClass}`}>
        {filtered.length > 0 ? (
          filtered.map((resource, index) => (
            <Fragment key={resource.name}>
              <ResourceCard resource={resource} index={index} />
              {index === 1 && filtered.length > 2 && (
                <aside className="route-annotation">
                  <span className="route-annotation__line" />
                  <p className="route-annotation__kicker">Checkpoint / operator note</p>
                  <b>{category === "Servers" ? "Verify capacity before you design around it." : category === "Databases" ? "Export early. Keep your project movable." : "Choose the smallest layer that completes the mission."}</b>
                  <p>{category === "Servers" ? "A genuine always-free VM is rare. Use accurate account details, confirm live capacity, and retain a second route before you commit your project." : category === "Domains" ? "A free subdomain is an effective launch tool, but it is not the same as owning a registrar domain." : "Document a fallback before a quota, credit pool, or inactivity rule interrupts a working project."}</p>
                </aside>
              )}
            </Fragment>
          ))
        ) : (
          <div className="no-results"><Search size={20} /> No routes found here. Try a different search.</div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [activeTechnicalFilter, setActiveTechnicalFilter] = useState<TechnicalFilter>("All");
  const [activeAudience, setActiveAudience] = useState<Resource["audience"] | "All audiences">("All audiences");
  const [search, setSearch] = useState("");
  const [shipCategory, setShipCategory] = useState<ShipCategory | "All deployment routes">("All deployment routes");
  const [operationKind, setOperationKind] = useState<OperationKind | "All operations">("All operations");
  const [operationMission, setOperationMission] = useState<OperationMission>("Portfolio & website");
  const [savedRouteNames, setSavedRouteNames] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem("the-arzens-saved-routes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeRoute, setActiveRoute] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const visibleResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatch = matchesTechnicalFilter(resource, activeTechnicalFilter);
      const audienceMatch = activeAudience === "All audiences" || resource.audience === activeAudience || resource.audience === "Everyone";
      const textMatch = `${resource.name} ${resource.category} ${resource.tag} ${resource.summary}`.toLowerCase().includes(query);
      return categoryMatch && audienceMatch && textMatch;
    });
  }, [activeAudience, activeTechnicalFilter, search]);

  const technicalFilters: TechnicalFilter[] = ["All", "Frontend", "Backend", "Servers", "Databases", "Domains", "Subdomains", "Labs"];
  const specialistFilters: TechnicalFilter[] = ["Operations", "Dev Tools", "Student Benefits", "AI Agents", "Security & CTF"];
  const audiences: (Resource["audience"] | "All audiences")[] = ["All audiences", "Developer", "Cyber student", "CTF organizer", "Student"];
  const shipCategories: (ShipCategory | "All deployment routes")[] = ["All deployment routes", "Static & frontend", "Backend & API", "Full-stack & data", "Servers & compute", "Domains & identity", "Free AI"];
  const operationKinds: (OperationKind | "All operations")[] = ["All operations", "Email", "Monitoring", "Authentication", "Storage", "Automation", "Design & CTF"];
  const visibleShipResources = shipResources.filter((resource) => shipCategory === "All deployment routes" || resource.category === shipCategory);
  const visibleOperationResources = useMemo(() => operationsResources.filter((resource) => operationKind === "All operations" || resource.kind === operationKind), [operationKind]);
  const activeMissionPlan = useMemo(() => operationMissions.find((plan) => plan.mission === operationMission) ?? operationMissions[0], [operationMission]);
  const activeMissionResources = useMemo(() => activeMissionPlan.resourceNames.map((name) => operationsResources.find((resource) => resource.name === name)).filter((resource): resource is OperationResource => Boolean(resource)), [activeMissionPlan]);
  const savedOperationResources = useMemo(() => operationsResources.filter((resource) => savedRouteNames.includes(resource.name)), [savedRouteNames]);

  useEffect(() => {
    const sections = nav.map((item) => document.getElementById(item.target)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible?.target.id) setActiveRoute(visible.target.id);
    }, { rootMargin: "-18% 0px -65% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("the-arzens-saved-routes", JSON.stringify(savedRouteNames));
    } catch {
      // The launchpad remains usable when browser storage is unavailable.
    }
  }, [savedRouteNames]);

  const handleCopyStack = async () => {
    const stack = "CTF starter stack: Oracle Cloud Always Free (CTFd control plane) + Cloudflare Pages (public frontend) + Cloudflare DNS/TLS + separate isolated challenge runners + backups in Oracle Object Storage or Cloudflare R2.";
    try {
      await navigator.clipboard.writeText(stack);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const toggleSavedRoute = (name: string) => {
    setSavedRouteNames((current) => current.includes(name) ? current.filter((route) => route !== name) : [...current, name]);
  };

  return (
    <div className="atlas-page" id="top">
      <aside className="atlas-rail" aria-label="Section navigation">
        <div className="rail-brand">
          <button className="brand-mark" onClick={() => { setActiveRoute("top"); scrollToId("top"); }} aria-label="Return to the top of THE ARZENS Intern Launchpad">
            <ArzensMark label="THE ARZENS logo" />
          </button>
          <span><b>THE</b><i>/</i>ARZENS</span>
        </div>
        <div className="rail-caption">Intern command<br />launchpad</div>
        <nav className="rail-nav">
          {nav.map((item) => (
            <button className={activeRoute === item.target ? "is-active" : ""} key={item.target} onClick={() => { setActiveRoute(item.target); scrollToId(item.target); }} aria-current={activeRoute === item.target ? "location" : undefined}>
              <span>{item.number}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="rail-foot">
          <span className="pulse-dot" />
          <span>Intern resource grid<br />Verified routes</span>
        </div>
      </aside>

      <header className="mobile-header">
        <button className="brand-mark brand-mark--mobile" onClick={() => { setActiveRoute("top"); scrollToId("top"); }} aria-label="Return to top">
          <ArzensMark />
        </button>
        <p>THE ARZENS</p>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {menuOpen && (
          <nav className="mobile-menu">
            {nav.map((item) => (
              <button className={activeRoute === item.target ? "is-active" : ""} key={item.target} onClick={() => { setActiveRoute(item.target); scrollToId(item.target); setMenuOpen(false); }} aria-current={activeRoute === item.target ? "location" : undefined}>
                <span>{item.number}</span>{item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section className="hero section-anchor" aria-labelledby="hero-title">
          <div className="hero__copy">
            <div className="hero__micro-row">
              <span className="eyebrow">THE ARZENS // INTERN OPERATIONS</span>
              <span className="verification-stamp"><Check size={13} /> Official routes only</span>
              <span className="pakistan-chip">PK / Global access</span>
            </div>
            <h1 id="hero-title"><span className="hero__brand">THE ARZENS</span><br />INTERN <em>LAUNCHPAD.</em></h1>
            <p className="hero__intro">Verified free infrastructure, safe cyber labs, AI workflows, and project stacks for THE ARZENS interns. Open a route, check its limits, then ship work that proves what you can build.</p>
            <div className="hero__actions">
              <Button onClick={() => scrollToId("deploy-free")} className="signal-button">Deploy a project <ArrowDownRight size={18} /></Button>
              <button onClick={() => scrollToId("finder")} className="text-button">Open resource grid <ArrowDownRight size={17} /></button>
            </div>
            <div className="hero__stats" aria-label="Website highlights">
              <div><strong>{resources.length + shipResources.length + operationsResources.length}</strong><span>official routes</span></div>
              <div><strong>04</strong><span>intern mission paths</span></div>
              <div><strong>00</strong><span>paid tools required</span></div>
            </div>
            <div className="hero__field-note"><span className="hero__field-note-pin" /><p><b>Access protocol:</b> country support, verification, capacity, and inactivity limits can decide whether a free route works. Read the operational note before deployment.</p></div>
          </div>
          <div className="hero__visual">
            <div className="system-grid" aria-hidden="true" />
            <ArzensMark label="THE ARZENS cyan logo" />
            <div className="hero__route-card">
              <span className="hero__route-dot" />
              <div><b>INTERN LAUNCH ROUTE READY</b><p>Verify → build → deploy</p></div>
              <ArrowUpRight size={17} />
            </div>
            <div className="hero__map-scale" aria-hidden="true"><span>SYS: ARZ-01</span><i /><span>STATUS: ONLINE</span></div>
          </div>
        </section>

        <section className="truth-strip" aria-label="What free access means">
          <div className="truth-strip__intro"><p className="eyebrow">System rules</p><h2>Know what<br />“free” means.</h2></div>
          <div className="truth-strip__items">
            <div><span className="legend-dot legend-dot--lime" /> <b>Always free</b><p>Ongoing quota, not unlimited.</p></div>
            <div><span className="legend-dot legend-dot--ink" /> <b>Free quota</b><p>Usage cap resets each month.</p></div>
            <div><span className="legend-dot legend-dot--rust" /> <b>Free credits</b><p>Temporary learning or trial budget.</p></div>
            <div><span className="legend-dot legend-dot--moss" /> <b>Check live</b><p>Country, card, and capacity can decide access.</p></div>
          </div>
        </section>

        <section className="journey-board section-anchor" id="journeys" aria-labelledby="journey-title">
          <div className="journey-board__lead">
            <p className="eyebrow">Select mission</p>
            <h2 id="journey-title">One clear mission.<br /><em>One real outcome.</em></h2>
            <p>Start where your project or career needs you. Each path routes you to an ethical, practical set of no-cost tools and learning environments.</p>
          </div>
          <div className="journey-board__grid">
            <button onClick={() => scrollToId("deploy-free")}><span>01 / DEPLOY</span><Code2 size={20} /><b>Ship a live project</b><small>Code → deploy → database → domain</small><ArrowDownRight size={18} /></button>
            <button className="journey-card--red" onClick={() => scrollToId("cyber-labs")}><span>02 / TRAIN</span><Crosshair size={20} /><b>Learn cybersecurity</b><small>Foundations → authorized labs → defense</small><ArzensMark tone="red" /><ArrowDownRight size={18} /></button>
            <button onClick={() => scrollToId("toolkit")}><span>03 / UNLOCK</span><GraduationCap size={20} /><b>Use student access</b><small>Verify → unlock software → build portfolio</small><ArrowDownRight size={18} /></button>
            <button className="journey-card--purple" onClick={() => scrollToId("agents")}><span>04 / RESEARCH</span><Sparkles size={20} /><b>Build with AI agents</b><small>Research → code → test → document</small><ArzensMark tone="purple" /><ArrowDownRight size={18} /></button>
          </div>
        </section>

        <section className="ship-free section-anchor" id="deploy-free" aria-labelledby="ship-free-title">
          <div className="ship-free__header">
            <div className="ship-free__marker"><span>01</span><p>SHIP YOUR<br />PROJECT FREE</p></div>
            <div>
              <p className="eyebrow">THE ARZENS / DEPLOYMENT CONTROL</p>
              <h2 id="ship-free-title">Your project deserves<br /><em>a public URL.</em></h2>
              <p>Start from what you are building, not from a random provider. These are practical free-entry routes for a website, frontend, API, database-backed app, Linux server, domain identity, or AI-assisted build sprint.</p>
            </div>
            <aside className="ship-free__warning"><CircleAlert size={18} /><p><b>Deployment truth:</b> “Free” can mean a monthly quota, temporary credits, a sleeping app, a subdomain, or account verification. Keep code in Git, keep secrets out of the frontend, and document a fallback route.</p></aside>
          </div>

          <div className="ship-free__stack-board" aria-label="Project starter stacks">
            {projectStacks.map((stack) => (
              <article className="ship-stack" key={stack.code}>
                <div className="ship-stack__code"><span>{stack.code}</span><i /></div>
                <h3>{stack.title}</h3>
                <p>{stack.description}</p>
                <div className="ship-stack__route"><span>Recommended start</span><b>{stack.route}</b></div>
                <small>{stack.note}</small>
                <div className="ship-stack__actions">
                  <button onClick={() => setShipCategory(stack.category)}>Filter routes <ArrowDownRight size={15} /></button>
                  <a href={stack.url} target="_blank" rel="noreferrer">Start official route <ArrowUpRight size={15} /></a>
                </div>
              </article>
            ))}
          </div>

          <div className="ship-free__catalog-head">
            <div><p className="eyebrow">Deployment resource grid</p><p><b>{visibleShipResources.length}</b> official routes for this launch decision</p></div>
            <a href="https://education.github.com/pack" target="_blank" rel="noreferrer">Check student benefits <ArrowUpRight size={16} /></a>
          </div>
          <div className="ship-free__filters" role="tablist" aria-label="Filter deployment resources">
            {shipCategories.map((category) => <button className={shipCategory === category ? "is-active" : ""} key={category} onClick={() => setShipCategory(category)} role="tab" aria-selected={shipCategory === category}>{category}</button>)}
          </div>
          <div className="ship-free__grid">
            {visibleShipResources.map((resource, index) => <ShipResourceCard resource={resource} index={index} key={resource.name} />)}
          </div>
        </section>

        <section className="operations-desk section-anchor" id="ops" aria-labelledby="ops-title">
          <div className="operations-desk__header">
            <div className="operations-desk__marker"><span>02</span><p>INTERN<br />OPERATIONS</p></div>
            <div>
              <p className="eyebrow">THE ARZENS / BUILD CONTINUITY</p>
              <h2 id="ops-title">A project is not finished<br /><em>when the URL opens.</em></h2>
              <p>Use these free operational layers to plan the work, add sign-in or email, automate a repeatable build, observe your own public service, and keep an authorized CTF event organized.</p>
            </div>
            <div className="operations-desk__review"><CircleCheckBig size={18} /><p><b>Source review, not live monitoring.</b> Free-entry details were checked against official provider routes for this release on 21 Aug 2026. Plans, quotas, and country availability can change after publication.</p></div>
          </div>

          <div className="operations-desk__workbench">
            <article className="pk-protocol" aria-labelledby="pk-title">
              <div className="pk-protocol__title"><span>PK</span><div><p className="eyebrow">Pakistan account protocol</p><h3 id="pk-title">Open accounts without bad surprises.</h3></div></div>
              <div className="pk-protocol__steps">
                {pakistanProtocol.map((step) => <div key={step.code}><span>{step.code}</span><div><b>{step.title}</b><p>{step.detail}</p></div></div>)}
              </div>
            </article>

            <article className="ops-planner" aria-labelledby="planner-title">
              <div className="ops-planner__header"><div><p className="eyebrow">Mission planner</p><h3 id="planner-title">Choose the project. Get the support layers.</h3></div><span>THE ARZENS / ROUTE-MATCH</span></div>
              <div className="ops-planner__missions" role="tablist" aria-label="Choose an intern project mission">
                {operationMissions.map((plan) => <button className={operationMission === plan.mission ? "is-active" : ""} key={plan.mission} onClick={() => setOperationMission(plan.mission)} role="tab" aria-selected={operationMission === plan.mission}>{plan.mission}</button>)}
              </div>
              <div className="ops-planner__result">
                <div><p className="eyebrow">Recommended operations bundle</p><h4>{activeMissionPlan.mission}</h4><p>{activeMissionPlan.outcome}</p></div>
                <div className="ops-planner__tools">
                  {activeMissionResources.map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={resource.name}><span>{resource.kind}</span><b>{resource.name}</b><ArrowUpRight size={14} /></a>)}
                </div>
                <div className="ops-planner__note"><CircleAlert size={15} /><p>{activeMissionPlan.deploymentNote}</p></div>
              </div>
              <button className="ops-planner__browse" onClick={() => { setOperationKind("All operations"); scrollToId("operations-catalog"); }}>Browse all support layers <ArrowDownRight size={16} /></button>
            </article>
          </div>

          <div className="saved-routes" aria-live="polite">
            <div className="saved-routes__title"><BookmarkCheck size={18} /><div><p className="eyebrow">Local route tray</p><b>{savedOperationResources.length} saved operational {savedOperationResources.length === 1 ? "route" : "routes"}</b></div></div>
            <p>Saved only in this browser on this device. It is not synced to a THE ARZENS account or shared with anyone.</p>
            <div className="saved-routes__list">
              {savedOperationResources.length > 0 ? savedOperationResources.map((resource) => <span key={resource.name}><a href={resource.url} target="_blank" rel="noreferrer">{resource.name}<ArrowUpRight size={13} /></a><button onClick={() => toggleSavedRoute(resource.name)} aria-label={`Remove ${resource.name} from saved routes`}>Remove</button></span>) : <em>Save a route from the operations grid to keep your personal shortlist here.</em>}
            </div>
          </div>

          <div className="operations-catalog" id="operations-catalog">
            <div className="operations-catalog__head"><div><p className="eyebrow">Operational tool layers</p><p><b>{visibleOperationResources.length}</b> official routes with a release review label and free-entry disclosure.</p></div><span><CircleCheckBig size={14} /> REVIEWED / 21 AUG 2026</span></div>
            <div className="operations-catalog__filters" role="tablist" aria-label="Filter operational resources">
              {operationKinds.map((kind) => <button className={operationKind === kind ? "is-active" : ""} key={kind} onClick={() => setOperationKind(kind)} role="tab" aria-selected={operationKind === kind}>{kind}</button>)}
            </div>
            <div className="operations-catalog__grid">
              {visibleOperationResources.map((resource, index) => <OperationResourceCard resource={resource} index={index} saved={savedRouteNames.includes(resource.name)} onToggleSaved={toggleSavedRoute} key={resource.name} />)}
            </div>
          </div>
        </section>

        <section className="finder section-anchor" id="finder" aria-labelledby="finder-title">
          <div className="finder__head">
            <div><p className="eyebrow">Resource command</p><h2 id="finder-title">Open the right tool.<br /><em>Complete the task.</em></h2></div>
            <div className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search frontend, backend, servers, labs…" aria-label="Search free resources" /></div>
          </div>
          <div className="finder__filter-group">
            <p className="eyebrow">Technical layer</p>
            <div className="filter-row" role="tablist" aria-label="Filter resources by technical layer">
              {technicalFilters.map((filter) => (
                <button className={`filter-chip ${activeTechnicalFilter === filter ? "is-active" : ""}`} key={filter} onClick={() => setActiveTechnicalFilter(filter)} role="tab" aria-selected={activeTechnicalFilter === filter}>{filter}</button>
              ))}
            </div>
          </div>
          <div className="finder__filter-group finder__filter-group--specialist">
            <p className="eyebrow">Specialist route</p>
            <div className="filter-row" role="tablist" aria-label="Filter specialist resources">
              {specialistFilters.map((filter) => (
                <button className={`filter-chip ${activeTechnicalFilter === filter ? "is-active" : ""}`} key={filter} onClick={() => setActiveTechnicalFilter(filter)} role="tab" aria-selected={activeTechnicalFilter === filter}>{filter}</button>
              ))}
            </div>
            <p className="finder__filter-note"><b>Domains</b> are naming and DNS routes. <b>Subdomains</b> are free shared hostnames or delegated routes; they are not the same as owning a registered domain.</p>
          </div>
          <div className="audience-row" role="tablist" aria-label="Filter resources by audience">
            <span>For:</span>
            {audiences.map((audience) => <button className={`audience-chip ${activeAudience === audience ? "is-active" : ""}`} key={audience} onClick={() => setActiveAudience(audience)} role="tab" aria-selected={activeAudience === audience}>{audience}</button>)}
          </div>
          <div className="finder__results">
            <div className="finder__result-label"><span className="signal-line" /> <p><b>{visibleResources.length}</b> routes match your filter</p></div>
            <div className="finder__featured-grid">
              {visibleResources.slice(0, 6).map((resource, index) => <ResourceCard resource={resource} index={index} key={resource.name} />)}
            </div>
          </div>
        </section>

        <CategorySection category="Servers" id="servers" search={search} />

        <section className="build-board section-anchor" id="build">
          <div className="build-board__marker"><span>02</span><p>BUILD<br />& DEPLOY</p></div>
          <div className="build-board__content">
            <p className="eyebrow">Two routes, one public product</p>
            <h2>Frontend outside.<br /><em>Logic where it fits.</em></h2>
            <p>Separate your public surface from the code that needs to run. This keeps a project cheaper, cleaner, and easier to move when a free limit changes.</p>
          </div>
          <div className="build-board__line" aria-hidden="true"><span /> <i /> <span /></div>
          <div className="build-board__route-list">
            <button onClick={() => scrollToId("frontend")}><Globe2 size={18} /><b>Static & frontend</b><span>Pages, GitHub, Firebase, shared hosting</span><ArrowDownRight size={17} /></button>
            <button onClick={() => scrollToId("backend")}><Code2 size={18} /><b>API & runtime</b><span>Workers, Docker PaaS, serverless, Python</span><ArrowDownRight size={17} /></button>
          </div>
        </section>

        <CategorySection category="Frontend" id="frontend" search={search} />
        <CategorySection category="Backend" id="backend" search={search} />
        <CategorySection category="Databases" id="data" search={search} />
        <CategorySection category="Domains" id="domains" search={search} />
        <CategorySection category="Learning" id="learning" search={search} />
        <CategorySection category="Cyber Labs" id="cyber-labs" search={search} />

        <section className="toolkit-break section-anchor" id="toolkit" aria-labelledby="toolkit-title">
          <div><p className="eyebrow">05 / Ship proof of work</p><h2 id="toolkit-title">The useful tool is the one<br /><em>you actually use in public.</em></h2><p>Version your projects. Write a short README. Publish a demo or a learning log. Then claim a student benefit only when it supports the work you already do.</p></div>
          <div className="toolkit-break__legend"><span><i /> Build with tools</span><span><i /> Verify student status</span><span><i /> Keep your work portable</span></div>
        </section>
        <CategorySection category="Dev Tools" id="dev-tools" search={search} />
        <CategorySection category="Student Packs" id="student-packs" search={search} />
        <CategorySection category="Defense & OSINT" id="defense" search={search} />

        <section id="agents" className="agents-panel section-anchor" aria-labelledby="agent-title">
          <div className="agents-panel__header">
            <div>
              <p className="eyebrow">06 / AI RESEARCH GRID</p>
              <div className="night-map-stamp"><ArzensMark tone="purple" label="THE ARZENS purple research mark" /><span>06</span><b>Research<br />node</b><i /></div>
              <h2 id="agent-title">Not every chat window<br /><em>runs a real task.</em></h2>
            </div>
            <p>These are the strongest free-entry web tools I could verify for multi-step work. Use the labels: some run code in a VM, some build apps inside a browser workspace, and some are simply useful web model interfaces.</p>
          </div>
          <div className="agent-legend">
            <span><i className="legend-dot legend-dot--lime" /> Cloud VM / code execution</span>
            <span><i className="legend-dot legend-dot--ink" /> Browser app agent</span>
            <span><i className="legend-dot legend-dot--moss" /> Agent workspace / web interface</span>
          </div>
          <div className="agent-grid">
            {resources.filter((resource) => resource.category === "AI Agents").map((resource, index) => <ResourceCard resource={resource} index={index} key={resource.name} />)}
          </div>
          <div className="agent-disclosure"><ShieldCheck size={19} /><p><b>Use these labels carefully:</b> “Free access” can mean a no-cost account, daily task allowance, or starter credits. It does not promise unlimited work, unrestricted browsers, or permanent sandbox compute. Check the live plan after you open the official page.</p></div>
        </section>

        <section className="ctf-zone section-anchor" id="ctf" aria-labelledby="ctf-title">
          <div className="ctf-zone__copy">
            <p className="eyebrow">07 / AUTHORIZED CTF CONTROL</p>
            <div className="ctf-brand-mark"><ArzensMark tone="red" label="THE ARZENS red CTF mark" /></div>
            <h2 id="ctf-title">Run the scoreboard.<br /><em>Isolate the challenge.</em></h2>
            <p>For a small authorized CTF, start with a control plane on Oracle Cloud, serve the public experience from Cloudflare Pages, and place intentionally vulnerable challenge containers on a separate isolated runner. Your scoreboard should never share unrestricted host access with a vulnerable web or pwn challenge.</p>
            <div className="ctf-zone__stack">
              <span>01 <b>Oracle VM</b><small>CTFd + MariaDB + Redis</small></span>
              <span>02 <b>Cloudflare</b><small>Pages + DNS + TLS</small></span>
              <span>03 <b>Separate runner</b><small>limited containers + cleanup</small></span>
            </div>
            <div className="ctf-zone__actions">
              <Button onClick={handleCopyStack} className="signal-button">{copied ? <><Check size={17} /> Stack copied</> : <>Copy starter stack <ArrowUpRight size={17} /></>}</Button>
              <a href="https://docs.ctfd.io/docs/deployment/installation/" target="_blank" rel="noreferrer" className="text-button">Open CTFd install docs <ExternalLink size={16} /></a>
            </div>
          </div>
          <div className="ctf-zone__visual" role="img" aria-label="Abstract isolated CTF infrastructure schematic"><ArzensMark tone="red" /><div className="ctf-zone__node ctf-zone__node--one" /><div className="ctf-zone__node ctf-zone__node--two" /><div className="ctf-zone__node ctf-zone__node--three" /></div>
        </section>
        <CategorySection category="CTF Operations" id="ctf-operations" search={search} />

        <section className="promise-strip">
          <div className="promise-strip__mark"><ArzensMark label="THE ARZENS logo" /></div>
          <div><p className="eyebrow">THE ARZENS INTERN PRINCIPLE</p><h2>Train safely. Ship with proof.<br />Keep your work portable.</h2></div>
          <a href="https://github.com/CTFd/CTFd" target="_blank" rel="noreferrer" className="promise-strip__link"><Github size={19} /> Open-source CTFd <ArrowUpRight size={18} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <p><b>THE ARZENS Intern Launchpad</b> is an operational resource directory, not a provider. Verify limits, availability, country support, and ethical use before you deploy or practice.</p>
        <div><a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noreferrer">Oracle Free Tier</a><a href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer">Cloudflare Pages</a><a href="https://neon.tech/pricing" target="_blank" rel="noreferrer">Neon Pricing</a></div>
      </footer>
    </div>
  );
}
