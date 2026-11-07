import { EmptyState } from "@platform/ui";
import { Stack, useRouter } from "expo-router";

import { Screen } from "../src/platform/Screen";

export default function NotFoundRoute() {
  const router = useRouter();
  return (
    <Screen>
      <Stack.Screen options={{ title: "Not found" }} />
      <EmptyState
        title="Page not found"
        actionLabel="Go to shop"
        onAction={() => router.replace("/")}
      />
    </Screen>
  );
}
