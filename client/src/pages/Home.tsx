/**
 * Signal Atlas design reminder: editorial information design, paper-white space, deep-ink type,
 * and signal-lime only for verified routes and clear actions. Avoid dashboard clutter or neon styling.
 */
import { Fragment, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  Github,
  Globe2,
  Menu,
  Network,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type Category =
  | "Servers"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Domains"
  | "AI Agents";

type Resource = {
  name: string;
  category: Category;
  tag: string;
  freeType: "Always free" | "Free quota" | "Free credits" | "No card" | "Free access" | "Check live";
  summary: string;
  note: string;
  url: string;
  recommendation?: boolean;
};

const resources: Resource[] = [
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

const nav = [
  { label: "Start here", target: "top", number: "00" },
  { label: "Servers", target: "servers", number: "01" },
  { label: "Build & deploy", target: "build", number: "02" },
  { label: "Data layer", target: "data", number: "03" },
  { label: "Domains", target: "domains", number: "04" },
  { label: "AI agents", target: "agents", number: "05" },
  { label: "CTF stack", target: "ctf", number: "06" },
];

const categoryIcons: Record<Category, typeof Server> = {
  Servers: Server,
  Frontend: Globe2,
  Backend: Network,
  Databases: Database,
  Domains: Cloud,
  "AI Agents": Sparkles,
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
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function FreeType({ value }: { value: Resource["freeType"] }) {
  const className = value === "Always free" || value === "No card" ? "route-tag route-tag--lime" : value === "Free credits" ? "route-tag route-tag--rust" : "route-tag";
  return <span className={className}>{value}</span>;
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
        <p className="resource-card__tag">{resource.tag}</p>
        <h3>{resource.name}</h3>
        <p className="resource-card__summary">{resource.summary}</p>
        <p className="resource-card__note"><CircleAlert size={14} /> {resource.note}</p>
      </div>
      <a className="resource-card__link" href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.name} official website`}>
        <span>Open official site</span>
        <ArrowUpRight size={18} />
      </a>
    </article>
  );
}

function CategorySection({ category, id, search }: { category: Category; id: string; search: string }) {
  const content = categoryNarrative[category];
  const gridClass = category.toLowerCase().replace(/\s+/g, "-");
  const filtered = resources.filter((resource) => {
    const matchedCategory = resource.category === category;
    const haystack = `${resource.name} ${resource.tag} ${resource.summary} ${resource.note}`.toLowerCase();
    return matchedCategory && haystack.includes(search.toLowerCase());
  });

  return (
    <section id={id} className="atlas-section section-anchor">
      <div className="section-heading">
        <div className="section-route" aria-hidden="true">
          <span className="section-route__number">{content.eyebrow.split(" /")[0]}</span>
          <i />
          <small>Mapped<br />route</small>
        </div>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p>{content.copy}</p>
      </div>
      <div className={`resource-grid resource-grid--${gridClass}`}>
        {filtered.length > 0 ? (
          filtered.map((resource, index) => (
            <Fragment key={resource.name}>
              <ResourceCard resource={resource} index={index} />
              {index === 1 && filtered.length > 2 && (
                <aside className="route-annotation">
                  <span className="route-annotation__line" />
                  <p className="route-annotation__kicker">Field note</p>
                  <b>{category === "Servers" ? "Capacity can be the real limit." : category === "Databases" ? "Export early. Stay portable." : "Choose the smallest working layer."}</b>
                  <p>{category === "Servers" ? "A genuine always-free VM is rare. Use accurate account details, then check live capacity before designing around it." : category === "Domains" ? "A free subdomain can be a good start, but it is not the same as owning a registrar domain." : "Keep a fallback route ready when a provider changes a quota, credits, or inactivity rule."}</p>
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
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const visibleResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatch = activeCategory === "All" || resource.category === activeCategory;
      const textMatch = `${resource.name} ${resource.category} ${resource.tag} ${resource.summary}`.toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
  }, [activeCategory, search]);

  const categories: (Category | "All")[] = ["All", "Servers", "Frontend", "Backend", "Databases", "Domains", "AI Agents"];

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

  return (
    <div className="atlas-page" id="top">
      <aside className="atlas-rail" aria-label="Section navigation">
        <div className="rail-brand">
          <button className="brand-mark" onClick={() => scrollToId("top")} aria-label="Return to the top of Signal Atlas">
            <img src="/manus-storage/signal-atlas-route-logo_83045ac8.png" alt="Signal Atlas route marker" />
          </button>
          <span><b>SIGNAL</b><i>/</i>ATLAS</span>
        </div>
        <div className="rail-caption">Free infrastructure<br />field guide</div>
        <nav className="rail-nav">
          {nav.map((item) => (
            <button key={item.target} onClick={() => scrollToId(item.target)}>
              <span>{item.number}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="rail-foot">
          <span className="pulse-dot" />
          <span>Research set<br />Aug ’26</span>
        </div>
      </aside>

      <header className="mobile-header">
        <button className="brand-mark brand-mark--mobile" onClick={() => scrollToId("top")} aria-label="Return to top">
          <img src="/manus-storage/signal-atlas-route-logo_83045ac8.png" alt="" />
        </button>
        <p>Signal Atlas</p>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {menuOpen && (
          <nav className="mobile-menu">
            {nav.map((item) => (
              <button key={item.target} onClick={() => { scrollToId(item.target); setMenuOpen(false); }}>
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
              <span className="eyebrow">A field guide for Pakistani builders</span>
              <span className="verification-stamp"><Check size={13} /> Link-first research</span>
              <span className="pakistan-chip">PK / field notes</span>
            </div>
            <h1 id="hero-title">Find the free layer<br /><em>that actually runs</em><br />your project.</h1>
            <p className="hero__intro">A living directory of free cloud servers, hosting, databases, domains, CTF infrastructure, and web AI agents. No guesswork—every route opens the official page.</p>
            <div className="hero__actions">
              <Button onClick={() => scrollToId("servers")} className="signal-button">Explore the routes <ArrowDownRight size={18} /></Button>
              <button onClick={() => scrollToId("agents")} className="text-button">Browse AI agents <ArrowDownRight size={17} /></button>
            </div>
            <div className="hero__stats" aria-label="Website highlights">
              <div><strong>37</strong><span>direct official routes</span></div>
              <div><strong>06</strong><span>infrastructure layers</span></div>
              <div><strong>01</strong><span>CTF-ready starting stack</span></div>
            </div>
            <div className="hero__field-note"><span className="hero__field-note-pin" /><p><b>Pakistan check:</b> card verification, country support, regional capacity, and inactivity rules can decide whether a “free” route works for you.</p></div>
          </div>
          <div className="hero__visual">
            <img src="/manus-storage/signal-atlas-hero_951ad4bb.png" alt="Abstract atlas of interconnected infrastructure routes" />
            <div className="hero__route-card">
              <span className="hero__route-dot" />
              <div><b>START HERE</b><p>Oracle VM → Cloudflare Pages → Neon</p></div>
              <ArrowUpRight size={17} />
            </div>
            <div className="hero__map-scale" aria-hidden="true"><span>33° 40′ N</span><i /><span>73° 02′ E</span></div>
          </div>
        </section>

        <section className="truth-strip" aria-label="What free access means">
          <div className="truth-strip__intro"><p className="eyebrow">Before you click</p><h2>“Free” is not one thing.</h2></div>
          <div className="truth-strip__items">
            <div><span className="legend-dot legend-dot--lime" /> <b>Always free</b><p>Ongoing quota, not unlimited.</p></div>
            <div><span className="legend-dot legend-dot--ink" /> <b>Free quota</b><p>Usage cap resets each month.</p></div>
            <div><span className="legend-dot legend-dot--rust" /> <b>Free credits</b><p>Temporary learning or trial budget.</p></div>
            <div><span className="legend-dot legend-dot--moss" /> <b>Check live</b><p>Country, card, and capacity can decide access.</p></div>
          </div>
        </section>

        <section className="finder section-anchor" id="finder" aria-labelledby="finder-title">
          <div className="finder__head">
            <div><p className="eyebrow">Route finder</p><h2 id="finder-title">Start with the job,<br />not the provider.</h2></div>
            <div className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search servers, Postgres, agent, CTF…" aria-label="Search free resources" /></div>
          </div>
          <div className="filter-row" role="tablist" aria-label="Filter resources by category">
            {categories.map((category) => (
              <button className={`filter-chip ${activeCategory === category ? "is-active" : ""}`} key={category} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>
            ))}
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

        <section id="agents" className="agents-panel section-anchor" aria-labelledby="agent-title">
          <div className="agents-panel__header">
            <div>
              <p className="eyebrow">05 / Free AI agent switchboard</p>
              <div className="night-map-stamp"><span>05</span><b>Night map<br />inset</b><i /></div>
              <h2 id="agent-title">Not every chat window<br /><em>is a sandbox agent.</em></h2>
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
            <p className="eyebrow">06 / Authorized CTF hosting</p>
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
          <div className="ctf-zone__visual"><img src="/manus-storage/ctf-isolation-atlas_b5d8d92a.png" alt="Abstract isolated CTF infrastructure illustration" /></div>
        </section>

        <section className="promise-strip">
          <div className="promise-strip__mark"><img src="/manus-storage/signal-atlas-route-logo_83045ac8.png" alt="" /></div>
          <div><p className="eyebrow">Build like you expect change</p><h2>Use free tiers for momentum.<br />Keep your data portable.</h2></div>
          <a href="https://github.com/CTFd/CTFd" target="_blank" rel="noreferrer" className="promise-strip__link"><Github size={19} /> Open-source CTFd <ArrowUpRight size={18} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <p><b>Signal Atlas</b> is a research directory, not a provider. Limits, availability, country support, and pricing can change.</p>
        <div><a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noreferrer">Oracle Free Tier</a><a href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer">Cloudflare Pages</a><a href="https://neon.tech/pricing" target="_blank" rel="noreferrer">Neon Pricing</a></div>
      </footer>
    </div>
  );
}
