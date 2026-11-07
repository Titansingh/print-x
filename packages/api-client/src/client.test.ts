import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { ApiError, buildPath, createApiClient } from "./index";

/**
 * TEST FIXTURE ONLY. A tiny `paths` shape in openapi-typescript's output
 * format, used to exercise the client's typing and runtime behavior.
 * It does not describe the real backend API.
 */
interface FixturePaths {
  "/widgets/{widgetId}": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never };
    get: {
      parameters: {
        query?: { expand?: string };
        header?: never;
        path: { widgetId: string };
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        200: { headers: Record<string, unknown>; content: { "application/json": { id: string } } };
        404: { headers: Record<string, unknown>; content?: never };
      };
    };
    put?: never;
    post?: never;
    delete: {
      parameters: { query?: never; header?: never; path: { widgetId: string }; cookie?: never };
      requestBody?: never;
      responses: { 204: { headers: Record<string, unknown>; content?: never } };
    };
  };
  "/widgets": {
    parameters: { query?: never; header?: never; path?: never; cookie?: never };
    get?: never;
    post: {
      parameters: { query?: never; header?: never; path?: never; cookie?: never };
      requestBody: { content: { "application/json": { name: string } } };
      responses: {
        201: { headers: Record<string, unknown>; content: { "application/json": { id: string } } };
      };
    };
  };
}

type Responder = (config: InternalAxiosRequestConfig) => { status: number; data?: unknown };

function fakeAdapter(respond: Responder) {
  const calls: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    calls.push(config);
    const { status, data } = respond(config);
    const response = { data, status, statusText: String(status), headers: {}, config, request: {} };
    const validate = config.validateStatus ?? ((s: number) => s >= 200 && s < 300);
    if (!validate(status)) {
      const { AxiosError } = await import("axios");
      throw new AxiosError(
        `Request failed with status code ${status}`,
        "ERR_BAD_RESPONSE",
        config,
        {},
        response,
      );
    }
    return response;
  };
  return { adapter, calls };
}

describe("createApiClient", () => {
  it("requires a base URL", () => {
    expect(() => createApiClient<FixturePaths>({ baseUrl: "" })).toThrow(/baseUrl/);
  });

  it("interpolates path params, sends query params and returns JSON data", async () => {
    const { adapter, calls } = fakeAdapter(() => ({ status: 200, data: { id: "w 1" } }));
    const client = createApiClient<FixturePaths>({ baseUrl: "https://api.test", adapter });

    const widget = await client.get("/widgets/{widgetId}", {
      params: { widgetId: "w 1" },
      query: { expand: "parts" },
    });

    expectTypeOf(widget).toEqualTypeOf<{ id: string }>();
    expect(widget).toEqual({ id: "w 1" });
    expect(calls[0]?.url).toBe("/widgets/w%201");
    expect(calls[0]?.params).toEqual({ expand: "parts" });
    expect(calls[0]?.method).toBe("get");
  });

  it("sends JSON bodies and returns undefined for 204 responses", async () => {
    const { adapter, calls } = fakeAdapter((config) =>
      config.method === "delete" ? { status: 204 } : { status: 201, data: { id: "new" } },
    );
    const client = createApiClient<FixturePaths>({ baseUrl: "https://api.test", adapter });

    const created = await client.post("/widgets", { body: { name: "Gift" } });
    expect(created).toEqual({ id: "new" });
    expect(JSON.parse(String(calls[0]?.data))).toEqual({ name: "Gift" });

    const removed = await client.delete("/widgets/{widgetId}", { params: { widgetId: "new" } });
    expectTypeOf(removed).toEqualTypeOf<undefined>();
    expect(removed).toBeUndefined();
  });

  it("attaches a bearer token when getAccessToken is provided", async () => {
    const { adapter, calls } = fakeAdapter(() => ({ status: 200, data: { id: "1" } }));
    const client = createApiClient<FixturePaths>({
      baseUrl: "https://api.test",
      adapter,
      getAccessToken: async () => "token-123",
    });

    await client.get("/widgets/{widgetId}", { params: { widgetId: "1" } });
    expect(calls[0]?.headers.get("Authorization")).toBe("Bearer token-123");
  });

  it("enables credentials for cookie sessions without adding an auth header", async () => {
    const { adapter, calls } = fakeAdapter(() => ({ status: 200, data: { id: "1" } }));
    const client = createApiClient<FixturePaths>({
      baseUrl: "https://api.test",
      adapter,
      withCredentials: true,
    });

    await client.get("/widgets/{widgetId}", { params: { widgetId: "1" } });
    expect(calls[0]?.withCredentials).toBe(true);
    expect(calls[0]?.headers.get("Authorization")).toBeUndefined();
  });

  it("normalizes HTTP errors and reports 401s", async () => {
    const onUnauthorized = vi.fn();
    const { adapter } = fakeAdapter(() => ({ status: 401, data: { message: "expired" } }));
    const client = createApiClient<FixturePaths>({
      baseUrl: "https://api.test",
      adapter,
      onUnauthorized,
    });

    const error = await client
      .get("/widgets/{widgetId}", { params: { widgetId: "1" } })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).kind).toBe("http");
    expect((error as ApiError).status).toBe(401);
    expect((error as ApiError).data).toEqual({ message: "expired" });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("rejects calls that do not match the contract at compile time", () => {
    const client = createApiClient<FixturePaths>({ baseUrl: "https://api.test" });
    // Type-level assertions only; these functions are never invoked.
    const assertions = () => {
      // @ts-expect-error unknown path
      void client.get("/unknown");
      // @ts-expect-error method not implemented for this path
      void client.get("/widgets");
      // @ts-expect-error missing required path params
      void client.get("/widgets/{widgetId}");
      // @ts-expect-error missing required body
      void client.post("/widgets");
    };
    expect(assertions).toBeTypeOf("function");
  });

  it("exposes no callable endpoints while the generated contract is a placeholder", () => {
    const client = createApiClient({ baseUrl: "https://api.test" });
    const assertions = () => {
      // @ts-expect-error the placeholder `paths` declares no endpoints
      void client.get("/products");
    };
    expect(assertions).toBeTypeOf("function");
  });
});

describe("buildPath", () => {
  it("throws for missing params", () => {
    expect(() => buildPath("/orders/{orderId}", {})).toThrow(ApiError);
  });
});
