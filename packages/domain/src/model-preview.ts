/**
 * Shared 3D preview contract used by both the web and the native viewer
 * packages, so their public APIs stay conceptually aligned.
 */

/** Formats the interactive viewers can render directly. */
export const previewFormats = ["glb", "gltf"] as const;
export type PreviewFormat = (typeof previewFormats)[number];

/**
 * Manufacturing/source formats. These are not previewed directly; the backend
 * model pipeline is expected to produce a GLB/GLTF preview asset for them.
 */
export const sourceModelFormats = ["stl", "3mf", "obj"] as const;
export type SourceModelFormat = (typeof sourceModelFormats)[number];

export type PreviewSupport = "interactive" | "requires-preview-asset" | "unsupported";

export interface ModelViewerSource {
  /** URL of the preview asset (typically a backend-issued signed URL). */
  url: string;
  format: PreviewFormat;
}

/** Imperative controls exposed by every viewer implementation. */
export interface ModelViewerHandle {
  resetCamera(): void;
}

export type ModelViewerStatus = "empty" | "loading" | "ready" | "error" | "unsupported";

export interface ModelViewerProps {
  /** Preview asset to display. `null`/`undefined` renders the empty state. */
  source?: ModelViewerSource | null;
  /** Accessible description of the model, e.g. the product name. */
  accessibilityLabel: string;
  /** Allow rotate/zoom gestures. Defaults to true. */
  interactive?: boolean;
  onStatusChange?: (status: ModelViewerStatus) => void;
  onError?: (error: Error) => void;
}

function extensionOf(value: string): string {
  const path = value.split(/[?#]/, 1)[0] ?? "";
  const dot = path.lastIndexOf(".");
  return dot === -1 ? value.toLowerCase() : path.slice(dot + 1).toLowerCase();
}

/** Determines how a file name, URL or bare format can be previewed. */
export function getPreviewSupport(fileNameOrFormat: string): PreviewSupport {
  const ext = extensionOf(fileNameOrFormat.trim());
  if ((previewFormats as readonly string[]).includes(ext)) return "interactive";
  if ((sourceModelFormats as readonly string[]).includes(ext)) return "requires-preview-asset";
  return "unsupported";
}

export function isPreviewFormat(value: string): value is PreviewFormat {
  return (previewFormats as readonly string[]).includes(value);
}
