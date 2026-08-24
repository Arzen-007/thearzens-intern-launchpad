import { describe, expect, it } from "vitest";
import { managedCatalogSchema, managedResourceInputSchema } from "./catalog";

const input = {
  id: "cloud-lab-demo",
  name: "Cloud Lab Demo",
  category: "Servers" as const,
  tag: "Demo route",
  freeType: "Free quota" as const,
  summary: "A sufficiently detailed, official free-entry demonstration resource for a project launch.",
  note: "Verify country availability, quota limits, and account requirements before deployment.",
  url: "https://example.com/signup",
  audience: "Developer" as const,
  level: "Build" as const,
};

describe("THE ARZENS managed catalog contract", () => {
  it("accepts a safe editable resource input", () => {
    expect(managedResourceInputSchema.parse(input)).toMatchObject({
      id: "cloud-lab-demo",
      category: "Servers",
      recommendation: false,
    });
  });

  it("keeps archived records in history without treating them as active records", () => {
    const catalog = managedCatalogSchema.parse({
      version: 1,
      updatedAt: "2026-08-25T00:00:00.000Z",
      resources: [
        { ...input, status: "active", updatedAt: "2026-08-25T00:00:00.000Z" },
        { ...input, id: "retired-demo", name: "Retired Demo", status: "archived", updatedAt: "2026-08-25T00:00:00.000Z" },
      ],
    });

    expect(catalog.resources.filter((resource) => resource.status === "active")).toHaveLength(1);
    expect(catalog.resources.filter((resource) => resource.status === "archived")).toHaveLength(1);
  });

  it("rejects malformed public links and unsafe catalog identifiers", () => {
    expect(managedResourceInputSchema.safeParse({ ...input, url: "not-a-url" }).success).toBe(false);
    expect(managedResourceInputSchema.safeParse({ ...input, id: "Unsafe identifier" }).success).toBe(false);
  });
});
