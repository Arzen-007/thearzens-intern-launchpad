/**
 * THE ARZENS design reminder: provider marks support intern scanning; THE ARZENS remains the
 * command system. Use official identity icons quietly and pair every mark with plain free-entry language.
 */
import { providerLogoPaths } from "@/data/providerLogoPaths";

type ProviderLike = {
  name: string;
  url: string;
  freeType: "Always free" | "Free quota" | "Free credits" | "No card" | "Free access" | "Check live";
};

const organizationByDomain: Record<string, string> = {
  "app.koyeb.com": "Koyeb",
  "app.netlify.com": "Netlify",
  "app.northflank.com": "Northflank",
  "app.turso.tech": "Turso",
  "aws.amazon.com": "Amazon Web Services",
  "azure.microsoft.com": "Microsoft Azure",
  "cloud.google.com": "Google Cloud",
  "console.cloud.google.com": "Google Cloud",
  "console.firebase.google.com": "Google Firebase",
  "dash.cloudflare.com": "Cloudflare",
  "pages.cloudflare.com": "Cloudflare",
  "pages.github.com": "GitHub",
  "docs.github.com": "GitHub",
  "education.github.com": "GitHub Education",
  "signup.cloud.oracle.com": "Oracle",
  "dashboard.render.com": "Render",
  "learn.microsoft.com": "Microsoft Learn",
  "cs50.harvard.edu": "Harvard University",
  "attack.mitre.org": "MITRE",
  "learning.cisa.gov": "CISA",
  "cheatsheetseries.owasp.org": "OWASP",
  "docs.ctfd.io": "CTFd",
  "hub.docker.com": "Docker",
  "jules.google.com": "Google",
  "gemini.google.com": "Google",
};

const freeEntryByType: Record<ProviderLike["freeType"], string> = {
  "Always free": "Always-free entry",
  "Free quota": "Free quota",
  "Free credits": "Free credits",
  "No card": "No-card free entry",
  "Free access": "Free access",
  "Check live": "Free offer — check live",
};

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function providerIdentityFor(resource: ProviderLike) {
  let domain = "";
  try {
    domain = new URL(resource.url).hostname.replace(/^www\./, "");
  } catch {
    domain = "";
  }

  const organization = organizationByDomain[domain] ?? resource.name;
  return {
    organization,
    logo: providerLogoPaths[domain],
    initials: initials(organization),
    offer: `${freeEntryByType[resource.freeType]} from ${organization}`,
  };
}
