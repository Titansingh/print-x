/**
 * Frontend permission identifiers used for navigation and UX gating ONLY.
 * The backend enforces authorization on every protected operation; hiding a
 * screen here is not a security control.
 *
 * Initial examples from the setup specification. Align this list with the
 * permission names the backend issues once its contract is published.
 */
export const permissions = [
  "products.read",
  "products.create",
  "products.update",
  "orders.read",
  "orders.assign",
  "orders.cancel",
  "print_jobs.read",
  "print_jobs.update",
  "print_jobs.complete",
  "quality_control.inspect",
  "partners.read",
  "partners.approve",
  "partners.manage",
  // PROVISIONAL: added to gate admin areas the initial examples do not cover.
  // Rename/remove to match the backend's permission model.
  "users.manage",
  "pricing.manage",
  "printers.manage",
  "models.review",
  "fulfillment.manage",
  "settings.manage",
] as const;

export type Permission = (typeof permissions)[number];

export function isPermission(value: string): value is Permission {
  return (permissions as readonly string[]).includes(value);
}
