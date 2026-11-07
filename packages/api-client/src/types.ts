/**
 * Type utilities that derive request/response shapes from an
 * openapi-typescript `paths` interface. Nothing here describes real endpoints.
 */

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type IsNever<T> = [T] extends [never] ? true : false;
type Defined<T> = Exclude<T, undefined>;
type EmptyObject = Record<never, never>;

/** The operation object for `paths[Path][Method]`, or `never` if absent. */
export type OperationFor<
  Paths,
  Path extends keyof Paths,
  Method extends HttpMethod,
> = Method extends keyof Paths[Path] ? NonNullable<Paths[Path][Method]> : never;

/** Paths that implement the given HTTP method. */
export type PathsWithMethod<Paths, Method extends HttpMethod> = {
  [Path in keyof Paths]: IsNever<OperationFor<Paths, Path, Method>> extends true ? never : Path;
}[keyof Paths];

type ParameterPart<Op, Part extends "path" | "query" | "header"> = Op extends {
  parameters: infer Params;
}
  ? Part extends keyof Params
    ? Defined<Params[Part]>
    : never
  : never;

type Content<Container> = Container extends { content: infer C }
  ? C extends Record<"application/json", infer Json>
    ? Json
    : C[keyof C]
  : never;

export type RequestBody<Op> = Op extends { requestBody?: infer Body }
  ? Content<Defined<Body>>
  : never;

type SuccessStatus = 200 | 201 | 202 | 203 | 204 | 206;

type Responses<Op> = Op extends { responses: infer R } ? R : never;

type SuccessResponse<Op> = {
  [Status in keyof Responses<Op>]: Status extends SuccessStatus ? Responses<Op>[Status] : never;
}[keyof Responses<Op>];

/** JSON payload of the operation's 2xx response (`undefined` for empty bodies). */
export type SuccessData<Op> =
  SuccessResponse<Op> extends { content: infer C }
    ? C extends Record<"application/json", infer Json>
      ? Json
      : C[keyof C]
    : undefined;

type Field<Key extends string, T> =
  IsNever<T> extends true
    ? { [K in Key]?: never }
    : EmptyObject extends T
      ? { [K in Key]?: T }
      : { [K in Key]: T };

export interface CommonRequestOptions {
  signal?: AbortSignal;
  /** Overrides the client's default timeout for this request. */
  timeoutMs?: number;
}

export type RequestOptions<Op> = Field<"params", ParameterPart<Op, "path">> &
  Field<"query", ParameterPart<Op, "query">> &
  Field<"headers", ParameterPart<Op, "header">> &
  Field<"body", RequestBody<Op>> &
  CommonRequestOptions;

/** Makes the options argument optional when nothing in it is required. */
export type RequestArgs<Op> =
  EmptyObject extends RequestOptions<Op>
    ? [options?: RequestOptions<Op>]
    : [options: RequestOptions<Op>];
