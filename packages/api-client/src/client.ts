import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import type { paths as GeneratedPaths } from "@platform/api-types";

import { ApiError, toApiError } from "./errors";
import type {
  HttpMethod,
  OperationFor,
  PathsWithMethod,
  RequestArgs,
  RequestOptions,
  SuccessData,
} from "./types";

type MaybePromise<T> = T | Promise<T>;

/**
 * Configuration injected by each app. The client never reads environment
 * variables itself (no `import.meta.env`, no `process.env.EXPO_PUBLIC_*`).
 */
export interface ApiClientOptions {
  /** Absolute API base URL, e.g. the app's VITE_API_URL / EXPO_PUBLIC_API_URL. */
  baseUrl: string;
  /**
   * Send cookies with requests. Use on the web for backend-managed,
   * HTTP-only session cookies. Requires matching backend CORS configuration.
   */
  withCredentials?: boolean;
  /**
   * Returns a bearer access token, e.g. read from secure storage on native.
   * Not used for cookie-based web sessions.
   */
  getAccessToken?: () => MaybePromise<string | null | undefined>;
  /** Invoked when the backend responds with 401 (e.g. to clear the session). */
  onUnauthorized?: (error: ApiError) => void;
  /** Default request timeout in ms. */
  timeoutMs?: number;
  /** Headers sent with every request (never put secrets here). */
  defaultHeaders?: Record<string, string>;
  /** Custom axios adapter (tests or platform-specific transports). */
  adapter?: AxiosRequestConfig["adapter"];
}

type MethodFn<Paths, Method extends HttpMethod> = <Path extends PathsWithMethod<Paths, Method>>(
  path: Path,
  ...args: RequestArgs<OperationFor<Paths, Path, Method>>
) => Promise<SuccessData<OperationFor<Paths, Path, Method>>>;

export interface ApiClient<Paths> {
  get: MethodFn<Paths, "get">;
  post: MethodFn<Paths, "post">;
  put: MethodFn<Paths, "put">;
  patch: MethodFn<Paths, "patch">;
  delete: MethodFn<Paths, "delete">;
  /** Underlying axios instance, for advanced cases (uploads with progress, etc.). */
  readonly axios: AxiosInstance;
}

const PATH_PARAM = /\{([^}]+)\}/g;

export function buildPath(template: string, params: Record<string, unknown> = {}): string {
  return template.replace(PATH_PARAM, (_, name: string) => {
    const value = params[name];
    if (value === undefined || value === null) {
      throw new ApiError(`Missing path parameter "${name}" for ${template}`, "unknown");
    }
    return encodeURIComponent(String(value));
  });
}

/**
 * Creates a typed REST client for the backend OpenAPI contract.
 *
 * @typeParam Paths - defaults to the generated `paths` from `@platform/api-types`.
 */
export function createApiClient<Paths = GeneratedPaths>(
  options: ApiClientOptions,
): ApiClient<Paths> {
  if (!options.baseUrl) {
    throw new Error("createApiClient: `baseUrl` is required");
  }

  const instance = axios.create({
    baseURL: options.baseUrl,
    withCredentials: options.withCredentials ?? false,
    timeout: options.timeoutMs ?? 30_000,
    headers: { Accept: "application/json", ...options.defaultHeaders },
    ...(options.adapter ? { adapter: options.adapter } : {}),
  });

  if (options.getAccessToken) {
    const getAccessToken = options.getAccessToken;
    instance.interceptors.request.use(async (config) => {
      const token = await getAccessToken();
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      return config;
    });
  }

  async function request(method: HttpMethod, path: string, opts: RequestOptions<unknown> = {}) {
    const { params, query, headers, body, signal, timeoutMs } = opts as {
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      headers?: Record<string, string>;
      body?: unknown;
      signal?: AbortSignal;
      timeoutMs?: number;
    };

    try {
      const response = await instance.request({
        method,
        url: buildPath(path, params),
        params: query,
        data: body,
        headers,
        signal,
        ...(timeoutMs !== undefined ? { timeout: timeoutMs } : {}),
      });
      return response.status === 204 ? undefined : response.data;
    } catch (error) {
      const apiError = toApiError(error);
      if (apiError.isUnauthorized) options.onUnauthorized?.(apiError);
      throw apiError;
    }
  }

  const method =
    <M extends HttpMethod>(name: M): MethodFn<Paths, M> =>
    (path, ...args) =>
      request(name, String(path), args[0] as RequestOptions<unknown> | undefined);

  return {
    get: method("get"),
    post: method("post"),
    put: method("put"),
    patch: method("patch"),
    delete: method("delete"),
    axios: instance,
  };
}
