import {
  isPreviewFormat,
  type ModelViewerHandle,
  type ModelViewerProps,
  type ModelViewerStatus,
} from "@platform/domain";
import { useEffect, useImperativeHandle, type ReactNode, type Ref } from "react";
import { Paragraph, YStack } from "tamagui";

/**
 * Native viewer boundary.
 *
 * PLACEHOLDER: no native 3D renderer is configured yet. Candidate approaches
 * (React Three Fiber's native renderer on expo-gl, or a dedicated native
 * module) must be validated on physical iOS/Android devices with the current
 * Expo SDK before adding native dependencies. See docs/architecture/3d-viewer.md.
 *
 * The props mirror the web viewer so feature code can stay aligned.
 */
export interface NativeModelViewerProps extends ModelViewerProps {
  ref?: Ref<ModelViewerHandle>;
  renderState?: (status: Exclude<ModelViewerStatus, "ready">) => ReactNode;
  height?: number;
}

export const nativeRendererAvailable = false;

export function NativeModelViewer({
  ref,
  source,
  accessibilityLabel,
  onStatusChange,
  renderState,
  height = 320,
}: NativeModelViewerProps) {
  const status: Exclude<ModelViewerStatus, "ready"> = !source
    ? "empty"
    : !isPreviewFormat(source.format) || !nativeRendererAvailable
      ? "unsupported"
      : "loading";

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // No-op until a renderer exists; keeps the imperative API stable.
  useImperativeHandle(ref, () => ({ resetCamera: () => undefined }), []);

  return (
    <YStack
      height={height}
      alignItems="center"
      justifyContent="center"
      padding="4"
      borderRadius="lg"
      backgroundColor="background"
      borderWidth={1}
      borderColor="border-color"
      aria-label={accessibilityLabel}
      testID="native-model-viewer-placeholder"
    >
      {renderState ? (
        renderState(status)
      ) : (
        <Paragraph color="muted" textAlign="center">
          {status === "empty"
            ? "No 3D preview available yet."
            : "Interactive 3D preview is coming soon to the app."}
        </Paragraph>
      )}
    </YStack>
  );
}
