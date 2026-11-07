import type { ReactElement } from "react";
import type { RouteObject } from "react-router";

import { DashboardPage } from "../../features/dashboard/DashboardPage";
import { OrdersPage } from "../../features/orders/OrdersPage";
import {
  CatalogPage,
  DeliveryPage,
  ModelGenerationPage,
  PartnersPage,
  PickupPage,
  PricingPage,
  PrintersPage,
  PrintJobsPage,
  QualityControlPage,
  UsersPage,
} from "../../features/placeholders";
import { SettingsPage } from "../../features/settings/SettingsPage";
import { AdminLayout } from "../../layouts/AdminLayout";
import { RequireAccess, RequireSession } from "../permissions/guards";
import { navItems } from "../permissions/navigation";
import { ForbiddenPage, NotFoundPage, SignInPage } from "./StatusPages";

const pageByPath: Record<string, ReactElement> = {
  "/": <DashboardPage />,
  "/users": <UsersPage />,
  "/catalog": <CatalogPage />,
  "/pricing": <PricingPage />,
  "/orders": <OrdersPage />,
  "/partners": <PartnersPage />,
  "/printers": <PrintersPage />,
  "/model-generation": <ModelGenerationPage />,
  "/print-jobs": <PrintJobsPage />,
  "/quality-control": <QualityControlPage />,
  "/pickup": <PickupPage />,
  "/delivery": <DeliveryPage />,
  "/settings": <SettingsPage />,
};

/** Routes are generated from the nav registry so access rules stay in one place. */
const protectedChildren: RouteObject[] = navItems.map((item) => {
  const element = <RequireAccess requirement={item.access}>{pageByPath[item.path]}</RequireAccess>;
  return item.path === "/"
    ? { index: true, element }
    : { path: `${item.path.slice(1)}/*`, element };
});

export const routes: RouteObject[] = [
  { path: "/sign-in", element: <SignInPage /> },
  {
    element: (
      <RequireSession>
        <AdminLayout />
      </RequireSession>
    ),
    children: [
      ...protectedChildren,
      { path: "forbidden", element: <ForbiddenPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
