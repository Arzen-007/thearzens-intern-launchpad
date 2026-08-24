import { z } from "zod";

export const MANAGED_CATALOG_PATH = "client/src/data/managedResources.json";
export const GITHUB_OWNER = "Arzen-007";
export const GITHUB_REPOSITORY = "thearzens-intern-launchpad";
export const GITHUB_BRANCH = "main";
export const GITHUB_PAGES_URL = "https://arzen-007.github.io/thearzens-intern-launchpad/";

export const categoryValues = [
  "Servers",
  "Frontend",
  "Backend",
  "Databases",
  "Domains",
  "AI Agents",
  "Learning",
  "Cyber Labs",
  "Dev Tools",
  "Student Packs",
  "Defense & OSINT",
  "CTF Operations",
  "Intern Operations",
] as const;

export const freeTypeValues = [
  "Always free",
  "Free quota",
  "Free credits",
  "No card",
  "Free access",
  "Check live",
] as const;

export const audienceValues = ["Developer", "Cyber student", "CTF organizer", "Student", "Everyone"] as const;
export const levelValues = ["Start", "Build", "Practice", "Operate"] as const;

export const managedResourceInputSchema = z.object({
  id: z.string().min(3).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  name: z.string().min(2).max(120),
  category: z.enum(categoryValues),
  tag: z.string().min(2).max(80),
  freeType: z.enum(freeTypeValues),
  summary: z.string().min(20).max(500),
  note: z.string().min(15).max(500),
  url: z.string().url().max(600),
  recommendation: z.boolean().optional().default(false),
  audience: z.enum(audienceValues).optional(),
  level: z.enum(levelValues).optional(),
});

export const managedResourceSchema = managedResourceInputSchema.extend({
  status: z.enum(["active", "archived"]),
  updatedAt: z.string().datetime(),
});

export const managedCatalogSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string().datetime().nullable(),
  resources: z.array(managedResourceSchema),
});

export type ManagedCatalog = z.infer<typeof managedCatalogSchema>;
export type ManagedResource = z.infer<typeof managedResourceSchema>;
export type ManagedResourceInput = z.infer<typeof managedResourceInputSchema>;
