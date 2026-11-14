import { PlaceholderPage } from "@platform/ui-admin";

/*
 * Representative placeholder routes for admin feature areas. Each moves to
 * its own folder under src/features/<area>/ when it is implemented.
 */

export const UsersPage = () => (
  <PlaceholderPage title="Users" description="Manage customer, staff and partner accounts." />
);
export const CatalogPage = () => (
  <PlaceholderPage title="Catalog" description="Products, variants and customization options." />
);
export const PricingPage = () => (
  <PlaceholderPage title="Pricing" description="Price lists, materials and service pricing." />
);
export const PartnersPage = () => (
  <PlaceholderPage title="Partners" description="Partner onboarding and verification." />
);
export const PrintersPage = () => (
  <PlaceholderPage
    title="Printers & materials"
    description="Review partners' printer capabilities, materials and capacity."
  />
);
export const ModelGenerationPage = () => (
  <PlaceholderPage title="Model review" description="Review AI-generated and uploaded 3D models." />
);
export const PrintJobsPage = () => (
  <PlaceholderPage title="Print jobs" description="Assign and monitor print jobs." />
);
export const QualityControlPage = () => (
  <PlaceholderPage
    title="Quality control"
    description="Inspect printed items and record results."
  />
);
export const PickupPage = () => (
  <PlaceholderPage title="Pickup" description="Coordinate partner pickups." />
);
export const DeliveryPage = () => (
  <PlaceholderPage title="Delivery" description="Coordinate deliveries and tracking." />
);
