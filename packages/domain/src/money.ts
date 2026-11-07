import { z } from "zod";

/**
 * Frontend money view model. Amounts are integers in the currency's minor
 * unit. When backend OpenAPI types exist, map API responses into this shape at
 * the feature/service boundary instead of redefining API types here.
 */
export const moneySchema = z.object({
  amountMinor: z.number().int(),
  currency: z
    .string()
    .length(3)
    .regex(/^[A-Z]{3}$/, "Use an ISO 4217 currency code"),
});

export type Money = z.infer<typeof moneySchema>;
