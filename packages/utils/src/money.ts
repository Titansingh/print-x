export interface FormatMoneyInput {
  /** Amount in the currency's minor unit (e.g. paise, cents). */
  amountMinor: number;
  /** ISO 4217 currency code, e.g. "INR", "USD". */
  currency: string;
}

const fractionDigitsCache = new Map<string, number>();

function getFractionDigits(currency: string): number {
  const cached = fractionDigitsCache.get(currency);
  if (cached !== undefined) return cached;
  const digits =
    new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2;
  fractionDigitsCache.set(currency, digits);
  return digits;
}

/**
 * Formats a minor-unit amount for display. Display only: totals, taxes and
 * rounding rules are owned by the backend.
 */
export function formatMoney({ amountMinor, currency }: FormatMoneyInput, locale?: string): string {
  const digits = getFractionDigits(currency);
  const major = amountMinor / 10 ** digits;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(major);
}
