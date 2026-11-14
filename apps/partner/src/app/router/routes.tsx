import type { ReactElement } from "react";
import type { RouteObject } from "react-router";
import { DashboardPage } from "../../features/dashboard/DashboardPage";
import { PrintersPage, PrintJobsPage } from "../../features/placeholders";
import { PartnerLayout } from "../../layouts/PartnerLayout";
import { RequireAccess, RequireSession } from "../permissions/guards";
import { navItems } from "../permissions/navigation";
import { ForbiddenPage, NotFoundPage, SignInPage } from "./StatusPages";

const pageByPath: Record<string, ReactElement> = {
  "/": <DashboardPage />,
  "/print-jobs": <PrintJobsPage />,
  "/printers": <PrintersPage />,
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
        <PartnerLayout />
      </RequireSession>
    ),
    children: [
      ...protectedChildren,
      { path: "forbidden", element: <ForbiddenPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
