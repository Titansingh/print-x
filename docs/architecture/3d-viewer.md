# 3D viewer

## Boundary

Web and native viewers are **separate packages** sharing one contract from
`@platform/domain` (`ModelViewerProps`, `ModelViewerSource`,
`ModelViewerHandle`, `ModelViewerStatus`). A browser WebGL component is not
assumed to run unchanged in Expo.

| Package                      | Renderer                            | Status                             |
| ---------------------------- | ----------------------------------- | ---------------------------------- |
| `@platform/3d-viewer-web`    | Three.js + React Three Fiber + drei | Implemented                        |
| `@platform/3d-viewer-native` | Not selected                        | Documented interface + placeholder |

Common API:

```ts
<ModelViewer
  source={{ url: signedPreviewUrl, format: "glb" }}  // null → empty state
  accessibilityLabel="3D preview of Custom wobble-head"
  interactive                                         // rotate/zoom gestures
  onStatusChange={(status) => {}}                     // empty | loading | ready | error | unsupported
  ref={viewerRef}                                     // viewerRef.current.resetCamera()
  renderState={(status) => <AppSpecificState />}      // optional custom state UI
/>
```

## Formats

| Format        | Role                         | Previewed directly?                                                    |
| ------------- | ---------------------------- | ---------------------------------------------------------------------- |
| GLB / GLTF    | Interactive preview asset    | Yes (preferred)                                                        |
| STL, 3MF, OBJ | Manufacturing/source formats | No. The backend model pipeline should produce a GLB/GLTF preview asset |

`getPreviewSupport(fileName)` in `@platform/domain` returns `interactive`,
`requires-preview-asset` or `unsupported`.

Model files live in **backend-managed object storage**, never in this
repository. The frontend receives (signed) URLs. Model metadata, versions,
dimensions, print settings and job status belong to backend contracts.

## Web implementation

- Lazy-loaded from the storefront (`features/3d-preview/ModelPreview.tsx`), so
  Three.js ships in its own chunk.
- Detects WebGL support and reports `unsupported` when unavailable.
- Loads GLB/GLTF with drei's `useGLTF`, frames it with `Bounds`/`Center`, and
  uses `OrbitControls` (rotate, zoom, damping; panning disabled).
  `resetCamera()` restores the initial view.
- Load/parse failures are caught by an error boundary and reported as `error`.

## Native: deferred

No native renderer has been added during setup, deliberately:

- Expo SDK 58 bundles `expo-gl ~58.0.4`, and React Three Fiber 9 lists
  `expo-gl`, `expo-asset` and `expo-file-system` as optional peers for its
  native renderer (`@react-three/fiber/native`). That path looks feasible, but
  it was not validated on physical iOS/Android devices during setup (GL
  context creation, GLB loading through `expo-asset`/`expo-file-system`,
  gesture handling, memory on low-end Android).
- Per the setup rules, incompatible or unvalidated native dependencies were
  not added. `@platform/3d-viewer-native` exports the shared contract and a
  placeholder (`nativeRendererAvailable = false`) that renders an accessible
  "coming soon" state.

### To implement

1. Spike `@react-three/fiber/native` + `expo-gl` in a development build
   (`expo-dev-client`) on real iOS and Android devices with representative
   GLB assets. Compare with a dedicated native module or a WebView-hosted
   viewer if performance or stability is insufficient.
2. Install the chosen dependencies with `npx expo install` (SDK-compatible
   versions) in `packages/3d-viewer-native` and `apps/mobile`.
3. Implement `NativeModelViewer` against the same props/handle; use native
   gestures for rotate/zoom.
4. Flip `nativeRendererAvailable` and add device E2E coverage (Maestro).
