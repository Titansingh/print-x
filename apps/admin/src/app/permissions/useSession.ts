import { canAccess, type AccessRequirement } from "@platform/auth-core";
import { useStore } from "zustand";

import { sessionStore } from "../../services/session";

export function useSession() {
  return useStore(sessionStore);
}

/** UX-only permission check. The backend remains the authority. */
export function useCanAccess(requirement: AccessRequirement | undefined): boolean {
  const session = useStore(sessionStore, (state) => state.session);
  return canAccess(session, requirement);
}
