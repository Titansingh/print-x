import { PlaceholderPage } from "@platform/ui-admin";

/*
 * Representative placeholder routes for partner feature areas. Each moves to
 * its own folder under src/features/<area>/ when it is implemented.
 */
export const PrintJobsPage = () => (
  <PlaceholderPage
    title="Print jobs"
    description="Assigned print jobs, status updates and evidence submission."
  />
);

export const PrintersPage = () => (
  <PlaceholderPage
    title="Printers & materials"
    description="Printer capabilities, materials and capacity."
  />
);
