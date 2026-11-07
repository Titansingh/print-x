export interface BackoffOptions {
  /** Delay for the first retry/poll, in ms. */
  initialMs?: number;
  /** Upper bound for any delay, in ms. */
  maxMs?: number;
  /** Multiplier applied per attempt. */
  factor?: number;
}

/**
 * Exponential backoff delay for polling long-running backend jobs (AI model
 * generation, print status). Attempt is zero-based.
 */
export function getBackoffDelay(
  attempt: number,
  { initialMs = 2_000, maxMs = 30_000, factor = 1.5 }: BackoffOptions = {},
): number {
  if (!Number.isFinite(attempt) || attempt < 0) return initialMs;
  return Math.min(maxMs, Math.round(initialMs * factor ** attempt));
}
