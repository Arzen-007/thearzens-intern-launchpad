import catalogSource from "./managedResources.json";
import { managedCatalogSchema, type ManagedCatalog } from "@shared/catalog";

export const managedCatalog: ManagedCatalog = managedCatalogSchema.parse(catalogSource);

export const activeManagedResources = managedCatalog.resources
  .filter((resource) => resource.status === "active")
  .map(({ id: _id, status: _status, updatedAt: _updatedAt, ...resource }) => resource);
