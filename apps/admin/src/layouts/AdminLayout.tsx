import { canAccess, roleConcepts } from "@platform/auth-core";
import {
  AppShell,
  Badge,
  Burger,
  Button,
  Group,
  NavLink as MantineNavLink,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavLink, Outlet, useLocation } from "react-router";

import { navGroups, navItems } from "../app/permissions/navigation";
import { useSession } from "../app/permissions/useSession";

/** Responsive application shell with permission-aware navigation. */
export function AdminLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const { session, signOut } = useSession();
  const location = useLocation();

  const visibleItems = navItems.filter((item) => canAccess(session, item.access));
  const role = session?.roles[0];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label={opened ? "Close navigation" : "Open navigation"}
            />
            <Text fw={700} c="brand">
              Print x Admin
            </Text>
          </Group>
          <Group gap="sm">
            {session ? (
              <>
                <Text size="sm" visibleFrom="sm">
                  {session.user.displayName}
                </Text>
                {role ? (
                  <Badge variant="light" visibleFrom="sm">
                    {roleConcepts[role].label}
                  </Badge>
                ) : null}
              </>
            ) : null}
            <Button variant="subtle" size="xs" onClick={() => void signOut()}>
              Sign out
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm" aria-label="Admin navigation">
        <AppShell.Section grow component={ScrollArea}>
          {navGroups.map((group) => {
            const items = visibleItems.filter((item) => item.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" px="sm" mt="md" mb={4}>
                  {group}
                </Text>
                {items.map((item) => (
                  <MantineNavLink
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    end={item.path === "/"}
                    label={item.label}
                    active={
                      item.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(item.path)
                    }
                    onClick={close}
                  />
                ))}
              </div>
            );
          })}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
