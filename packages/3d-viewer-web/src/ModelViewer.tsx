import {
  isPreviewFormat,
  type ModelViewerHandle,
  type ModelViewerProps,
  type ModelViewerStatus,
} from "@platform/domain";
import { Bounds, Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";

import { ViewerErrorBoundary } from "./ViewerErrorBoundary";
import { isWebGLAvailable } from "./webgl";

export interface WebModelViewerProps extends ModelViewerProps {
  ref?: Ref<ModelViewerHandle>;
  /** Custom UI for non-ready states (e.g. Tamagui components from the app). */
  renderState?: (status: Exclude<ModelViewerStatus, "ready">) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

const defaultStateText: Record<Exclude<ModelViewerStatus, "ready">, string> = {
  empty: "No 3D preview available yet.",
  loading: "Loading 3D preview…",
  error: "The 3D preview could not be loaded.",
  unsupported: "3D preview is not supported on this device or for this file type.",
};

function DefaultState({ status }: { status: Exclude<ModelViewerStatus, "ready"> }) {
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      data-viewer-state={status}
      style={{ display: "grid", placeItems: "center", height: "100%", padding: 16 }}
    >
      {defaultStateText[status]}
    </div>
  );
}

function Model({ url, onLoaded }: { url: string; onLoaded: () => void }) {
  const { scene } = useGLTF(url);
  useEffect(onLoaded, [onLoaded, scene]);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

/**
 * Interactive web viewer for GLB/GLTF preview assets (rotate, zoom, reset).
 * Source formats such as STL/3MF/OBJ require a backend-generated preview asset.
 */
export function ModelViewer({
  ref,
  source,
  accessibilityLabel,
  interactive = true,
  onStatusChange,
  onError,
  renderState,
  className,
  style,
}: WebModelViewerProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const [webglAvailable] = useState(isWebGLAvailable);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const status: ModelViewerStatus = !source
    ? "empty"
    : !isPreviewFormat(source.format) || !webglAvailable
      ? "unsupported"
      : failedUrl === source.url
        ? "error"
        : loadedUrl === source.url
          ? "ready"
          : "loading";

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useImperativeHandle(ref, () => ({ resetCamera: () => controlsRef.current?.reset() }), []);

  const url = source?.url;
  const handleLoaded = useCallback(() => {
    if (url) setLoadedUrl(url);
  }, [url]);
  const handleError = useCallback(
    (error: Error) => {
      if (url) setFailedUrl(url);
      onError?.(error);
    },
    [url, onError],
  );

  const renderOverlay = (s: Exclude<ModelViewerStatus, "ready">) =>
    renderState ? renderState(s) : <DefaultState status={s} />;

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: 360,
    ...style,
  };

  if (status === "empty" || status === "unsupported" || !source) {
    return (
      <div className={className} style={containerStyle} aria-label={accessibilityLabel}>
        {renderOverlay(status === "ready" ? "loading" : (status as "empty" | "unsupported"))}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={containerStyle}
      role="img"
      aria-label={accessibilityLabel}
      aria-busy={status === "loading"}
    >
      <ViewerErrorBoundary
        resetKey={source.url}
        onError={handleError}
        fallback={renderOverlay("error")}
      >
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={1.2} />
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Model url={source.url} onLoaded={handleLoaded} />
            </Bounds>
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enabled={interactive}
            enablePan={false}
            enableDamping
          />
        </Canvas>
      </ViewerErrorBoundary>
      {status === "loading" ? (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {renderOverlay("loading")}
        </div>
      ) : null}
    </div>
  );
}
