import { describe, expect, it } from "vitest";

import { formatMoney, getBackoffDelay } from "./index";

describe("formatMoney", () => {
  it("formats minor units using the currency's fraction digits", () => {
    expect(formatMoney({ amountMinor: 129_900, currency: "INR" }, "en-IN")).toBe("₹1,299.00");
    expect(formatMoney({ amountMinor: 1_999, currency: "USD" }, "en-US")).toBe("$19.99");
  });

  it("handles zero-decimal currencies", () => {
    expect(formatMoney({ amountMinor: 500, currency: "JPY" }, "en-US")).toBe("¥500");
  });
});

describe("getBackoffDelay", () => {
  it("grows exponentially and is capped", () => {
    expect(getBackoffDelay(0)).toBe(2_000);
    expect(getBackoffDelay(1)).toBe(3_000);
    expect(getBackoffDelay(50)).toBe(30_000);
  });

  it("falls back to the initial delay for invalid attempts", () => {
    expect(getBackoffDelay(-1)).toBe(2_000);
    expect(getBackoffDelay(Number.NaN)).toBe(2_000);
  });
});
