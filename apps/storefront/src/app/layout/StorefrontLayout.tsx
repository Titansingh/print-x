import { BodyText } from "@platform/ui";
import { NavLink, Outlet } from "react-router";
import { SizableText, XStack, YStack } from "tamagui";

const navItems = [
  { to: "/", label: "Shop", end: true },
  { to: "/models", label: "My models" },
  { to: "/orders", label: "Orders" },
  { to: "/cart", label: "Cart" },
] as const;

export function StorefrontLayout() {
  return (
    <YStack minH="100vh" backgroundColor="background">
      <XStack
        render="header"
        items="center"
        justify="space-between"
        flexWrap="wrap"
        gap="4"
        px="4 md:8"
        py="3"
        borderBottomWidth={1}
        borderColor="border-color"
        backgroundColor="surface"
      >
        <NavLink to="/" aria-label="Storefront home" style={{ textDecoration: "none" }}>
          <SizableText size="lg" fontWeight="700" color="primary">
            Print x
          </SizableText>
        </NavLink>
        <nav aria-label="Main">
          <XStack gap="4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : undefined}
                style={{ textDecoration: "none" }}
              >
                {({ isActive }) => (
                  <SizableText
                    size="sm"
                    fontWeight={isActive ? "700" : "500"}
                    color={isActive ? "primary" : "text"}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </SizableText>
                )}
              </NavLink>
            ))}
          </XStack>
        </nav>
      </XStack>
      <YStack render="main" flex={1}>
        <Outlet />
      </YStack>
      <XStack render="footer" px="4" py="6" justify="center">
        <BodyText tone="muted" size="sm">
          Gifts and on-demand 3D printing in your city.
        </BodyText>
      </XStack>
    </YStack>
  );
}
