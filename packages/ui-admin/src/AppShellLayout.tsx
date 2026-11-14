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
import type { MouseEvent, ReactNode } from "react";

export interface ShellNavItem {
  path: string;
  label: string;
  group: string;
}

export interface AppShellLayoutProps {
  /** Product name shown in the header, e.g. "Print x Admin". */
  brand: string;
  /** Accessible name of the navigation landmark. */
  navLabel: string;
  /** Group order; groups without visible items are skipped. */
  groups: readonly string[];
  /** Items the current session may see (filter by permission in the app). */
  items: readonly ShellNavItem[];
  isActive: (path: string) => boolean;
  /** Client-side navigation callback; the shell never receives router objects. */
  onNavigate: (path: string) => void;
  user?: { name: string; roleLabel?: string };
  onSignOut: () => void;
  children: ReactNode;
}

function isModifiedClick(event: MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

/** Responsive application shell with grouped navigation for the Mantine web apps. */
export function AppShellLayout({
  brand,
  navLabel,
  groups,
  items,
  isActive,
  onNavigate,
  user,
  onSignOut,
  children,
}: AppShellLayoutProps) {
  const [opened, { toggle, close }] = useDisclosure();

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
              {brand}
            </Text>
          </Group>
          <Group gap="sm">
            {user ? (
              <>
                <Text size="sm" visibleFrom="sm">
                  {user.name}
                </Text>
                {user.roleLabel ? (
                  <Badge variant="light" visibleFrom="sm">
                    {user.roleLabel}
                  </Badge>
                ) : null}
              </>
            ) : null}
            <Button variant="subtle" size="xs" onClick={onSignOut}>
              Sign out
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm" aria-label={navLabel}>
        <AppShell.Section grow component={ScrollArea}>
          {groups.map((group) => {
            const groupItems = items.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" px="sm" mt="md" mb={4}>
                  {group}
                </Text>
                {groupItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <MantineNavLink
                      key={item.path}
                      href={item.path}
                      label={item.label}
                      active={active}
                      aria-current={active ? "page" : undefined}
                      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                        if (isModifiedClick(event)) return;
                        event.preventDefault();
                        onNavigate(item.path);
                        close();
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
