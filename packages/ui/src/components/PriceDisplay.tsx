import type { Money } from "@platform/domain";
import { formatMoney } from "@platform/utils";
import { SizableText, XStack } from "tamagui";

export interface PriceDisplayProps {
  price: Money;
  /** Original price, shown struck through when higher than `price`. */
  compareAt?: Money;
  /** Prefix such as "From" for configurable products. */
  prefix?: string;
  size?: "sm" | "md" | "lg";
  locale?: string;
}

const fontSizeBySize = { sm: "sm", md: "base", lg: "xl" } as const;

/** Display-only price formatting. Pricing rules are owned by the backend. */
export function PriceDisplay({ price, compareAt, prefix, size = "md", locale }: PriceDisplayProps) {
  const formatted = formatMoney(price, locale);
  const showCompare =
    compareAt !== undefined &&
    compareAt.currency === price.currency &&
    compareAt.amountMinor > price.amountMinor;
  const formattedCompare = showCompare ? formatMoney(compareAt, locale) : undefined;
  const label = [prefix, formatted, formattedCompare ? `was ${formattedCompare}` : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <XStack gap="2" items="baseline" aria-label={label}>
      <SizableText size={fontSizeBySize[size]} fontWeight="600" color="text">
        {prefix ? `${prefix} ` : ""}
        {formatted}
      </SizableText>
      {formattedCompare ? (
        <SizableText size="sm" color="muted" textDecorationLine="line-through" aria-hidden>
          {formattedCompare}
        </SizableText>
      ) : null}
    </XStack>
  );
}
