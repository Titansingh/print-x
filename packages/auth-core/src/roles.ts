/**
 * Role concepts for the unified admin. Roles are descriptive only: access is
 * decided from the permissions the backend grants to a session, so new or
 * custom roles need no frontend changes. Do not derive permissions from roles
 * in the frontend.
 */
export const roleConcepts = {
  super_admin: { label: "Super Admin", description: "Full platform access." },
  platform_admin: {
    label: "Platform Admin",
    description: "Users, catalog, pricing, partner management and settings.",
  },
  operations_manager: {
    label: "Operations Manager",
    description: "Orders, model review, assignment, quality control and fulfillment.",
  },
  operations_staff: {
    label: "Operations Staff",
    description: "Explicitly assigned operational tasks.",
  },
  partner_admin: {
    label: "Partner Admin",
    description: "Partner profile, printers, materials, team and capacity.",
  },
  partner_staff: {
    label: "Partner Staff",
    description: "Assigned print jobs, status updates and evidence submission.",
  },
} as const;

export type RoleId = keyof typeof roleConcepts;
