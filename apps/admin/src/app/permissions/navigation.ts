import type { AccessRequirement } from "@platform/auth-core";

export interface NavItem {
  path: string;
  label: string;
  group: "Overview" | "Commerce" | "Partners" | "Operations" | "Administration";
  /** Permission requirement for showing the item and entering the route. */
  access?: AccessRequirement;
}

/**
 * Single source of truth for admin navigation and route access. Items are
 * shown based on the permissions in the session, not on hardcoded roles, so
 * new roles defined by the backend need no frontend change.
 */
export const navItems: readonly NavItem[] = [
  { path: "/", label: "Dashboard", group: "Overview" },
  { path: "/users", label: "Users", group: "Administration", access: { allOf: ["users.manage"] } },
  { path: "/catalog", label: "Catalog", group: "Commerce", access: { allOf: ["products.read"] } },
  { path: "/pricing", label: "Pricing", group: "Commerce", access: { allOf: ["pricing.manage"] } },
  { path: "/orders", label: "Orders", group: "Commerce", access: { allOf: ["orders.read"] } },
  { path: "/partners", label: "Partners", group: "Partners", access: { allOf: ["partners.read"] } },
  {
    path: "/printers",
    label: "Printers & materials",
    group: "Partners",
    access: { anyOf: ["printers.manage", "partners.manage"] },
  },
  {
    path: "/model-generation",
    label: "Model review",
    group: "Operations",
    access: { allOf: ["models.review"] },
  },
  {
    path: "/print-jobs",
    label: "Print jobs",
    group: "Operations",
    access: { allOf: ["print_jobs.read"] },
  },
  {
    path: "/quality-control",
    label: "Quality control",
    group: "Operations",
    access: { allOf: ["quality_control.inspect"] },
  },
  {
    path: "/pickup",
    label: "Pickup",
    group: "Operations",
    access: { allOf: ["fulfillment.manage"] },
  },
  {
    path: "/delivery",
    label: "Delivery",
    group: "Operations",
    access: { allOf: ["fulfillment.manage"] },
  },
  {
    path: "/settings",
    label: "Settings & roles",
    group: "Administration",
    access: { allOf: ["settings.manage"] },
  },
];

export const navGroups = [
  "Overview",
  "Commerce",
  "Partners",
  "Operations",
  "Administration",
] as const;
