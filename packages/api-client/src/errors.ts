import { isAxiosError } from "axios";

export type ApiErrorKind = "http" | "network" | "timeout" | "aborted" | "unknown";

/** Normalized error for every failed request made through the API client. */
export class ApiError extends Error {
  override readonly name = "ApiError";

  constructor(
    message: string,
    readonly kind: ApiErrorKind,
    /** HTTP status for `kind === "http"`. */
    readonly status?: number,
    /** Parsed response body (shape defined by the backend contract). */
    readonly data?: unknown,
    options?: { cause?: unknown },
  ) {
    super(message, options);
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    if (error.code === "ERR_CANCELED") {
      return new ApiError("Request was cancelled", "aborted", undefined, undefined, {
        cause: error,
      });
    }
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError("Request timed out", "timeout", undefined, undefined, { cause: error });
    }
    if (error.response) {
      return new ApiError(
        `Request failed with status ${error.response.status}`,
        "http",
        error.response.status,
        error.response.data,
        { cause: error },
      );
    }
    return new ApiError("Network request failed", "network", undefined, undefined, {
      cause: error,
    });
  }

  return new ApiError(
    error instanceof Error ? error.message : "Unknown error",
    "unknown",
    undefined,
    undefined,
    {
      cause: error,
    },
  );
}
