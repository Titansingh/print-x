import type { AccessRequirement } from "@platform/auth-core";
import { LoadingView } from "@platform/ui-admin";
import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useCanAccess, useSession } from "./useSession";

/**
 * Authenticated route boundary. Loads the session once and redirects to the
 * sign-in page when signed out. UX only: the backend rejects unauthenticated
 * requests regardless of what the frontend renders.
 */
export function RequireSession({ children }: { children: ReactNode }) {
  const { status, refresh } = useSession();
  const location = useLocation();

  useEffect(() => {
    if (status === "idle") void refresh();
  }, [status, refresh]);

  if (status === "idle" || status === "loading")
    return <LoadingView label="Checking your session" />;
  if (status !== "authenticated") {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }
  return children;
}

/** Permission-aware route guard. Hides UI; it is not a security control. */
export function RequireAccess({
  requirement,
  children,
}: {
  requirement?: AccessRequirement;
  children: ReactNode;
}) {
  const allowed = useCanAccess(requirement);
  return allowed ? children : <Navigate to="/forbidden" replace />;
}
