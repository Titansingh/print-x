import type { AccessRequirement } from "@platform/auth-core";

export interface NavItem {
  path: string;
  label: string;
  group: "Overview" | "Production" | "Business";
  /** Permission requirement for showing the item and entering the route. */
  access?: AccessRequirement;
}

/**
 * Single source of truth for partner navigation and route access. Items are
 * shown based on the permissions in the session, not on hardcoded roles.
 * Frontend checks are UX only; the backend enforces authorization.
 */
export const navItems: readonly NavItem[] = [
  { path: "/", label: "Dashboard", group: "Overview" },
  {
    path: "/print-jobs",
    label: "Print jobs",
    group: "Production",
    access: { allOf: ["print_jobs.read"] },
  },
  {
    path: "/printers",
    label: "Printers & materials",
    group: "Business",
    access: { allOf: ["printers.manage"] },
  },
];

export const navGroups = ["Overview", "Production", "Business"] as const;
