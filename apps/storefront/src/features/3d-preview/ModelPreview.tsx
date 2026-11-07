import type { ModelViewerSource } from "@platform/domain";
import { BodyText, EmptyState, ErrorState, LoadingState } from "@platform/ui";
import { lazy, Suspense } from "react";
import { YStack } from "tamagui";

// Three.js/R3F are large; load the viewer only when a preview is shown.
const ModelViewer = lazy(() =>
  import("@platform/3d-viewer-web").then((module) => ({ default: module.ModelViewer })),
);

export interface ModelPreviewProps {
  source: ModelViewerSource | null;
  productName: string;
}

export function ModelPreview({ source, productName }: ModelPreviewProps) {
  return (
    <YStack
      borderWidth={1}
      borderColor="border-color"
      rounded="lg"
      overflow="hidden"
      backgroundColor="surface"
    >
      <Suspense fallback={<LoadingState label="Loading 3D viewer" />}>
        <ModelViewer
          source={source}
          accessibilityLabel={`3D preview of ${productName}`}
          renderState={(status) => {
            switch (status) {
              case "empty":
                return (
                  <EmptyState
                    title="Preview coming soon"
                    description="A 3D preview appears here once the model is ready."
                  />
                );
              case "loading":
                return <LoadingState label="Loading 3D preview" />;
              case "error":
                return <ErrorState message="The 3D preview could not be loaded." />;
              case "unsupported":
                return (
                  <YStack p="6" items="center">
                    <BodyText tone="muted">
                      3D preview isn&apos;t supported on this device.
                    </BodyText>
                  </YStack>
                );
            }
          }}
        />
      </Suspense>
    </YStack>
  );
}
