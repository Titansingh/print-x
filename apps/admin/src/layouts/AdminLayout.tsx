import { canAccess, roleConcepts } from "@platform/auth-core";
import { AppShellLayout } from "@platform/ui-admin";
import { Outlet, useLocation, useNavigate } from "react-router";

import { navGroups, navItems } from "../app/permissions/navigation";
import { useSession } from "../app/permissions/useSession";

/** Admin shell: the shared Mantine shell with permission-aware navigation. */
export function AdminLayout() {
  const { session, signOut } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const visibleItems = navItems.filter((item) => canAccess(session, item.access));
  const role = session?.roles[0];

  return (
    <AppShellLayout
      brand="Print x Admin"
      navLabel="Admin navigation"
      groups={navGroups}
      items={visibleItems}
      isActive={(path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
      }
      onNavigate={(path) => void navigate(path)}
      user={
        session
          ? { name: session.user.displayName, roleLabel: role && roleConcepts[role].label }
          : undefined
      }
      onSignOut={() => void signOut()}
    >
      <Outlet />
    </AppShellLayout>
  );
}
