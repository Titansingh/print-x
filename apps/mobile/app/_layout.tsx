import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "../src/providers/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
        <Stack.Screen name="index" options={{ title: "Shop" }} />
        <Stack.Screen name="products/[productId]" options={{ title: "Product" }} />
        <Stack.Screen name="orders" options={{ title: "Orders" }} />
      </Stack>
    </AppProviders>
  );
}
