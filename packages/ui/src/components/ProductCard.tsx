import type { Money, StatusTone } from "@platform/domain";
import { Card, Image, YStack } from "tamagui";

import { PriceDisplay } from "./PriceDisplay";
import { StatusBadge } from "./StatusBadge";
import { BodyText } from "./Text";

export interface ProductCardProps {
  title: string;
  price: Money;
  /** Show "From" before the price (configurable/customizable products). */
  priceIsStartingFrom?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  badge?: { label: string; tone?: StatusTone };
  onPress?: () => void;
}

/**
 * Presentational product tile shared by web and native. Navigation is
 * injected via `onPress` so each app keeps its own router.
 */
export function ProductCard({
  title,
  price,
  priceIsStartingFrom = false,
  imageUrl,
  imageAlt = "",
  badge,
  onPress,
}: ProductCardProps) {
  const interactive = Boolean(onPress);

  return (
    <Card
      role={interactive ? "button" : undefined}
      aria-label={interactive ? title : undefined}
      tabIndex={interactive ? 0 : undefined}
      onPress={onPress}
      overflow="hidden"
      borderWidth={1}
      backgroundColor="surface"
      // Tamagui 3 style grammar: interaction states are value modifiers.
      borderColor={interactive ? "border-color hover:border-color-hover" : "border-color"}
      opacity={interactive ? "press:0.85" : undefined}
      cursor={interactive ? "web:pointer" : undefined}
      outlineColor="focus-visible:focus-ring"
      outlineStyle="focus-visible:solid"
      outlineWidth="focus-visible:2px"
    >
      <YStack aspectRatio={1} backgroundColor="background">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt} width="100%" height="100%" objectFit="cover" />
        ) : null}
      </YStack>
      <YStack gap="2" p="4">
        {badge ? <StatusBadge label={badge.label} tone={badge.tone} /> : null}
        <BodyText fontWeight="600" numberOfLines={2}>
          {title}
        </BodyText>
        <PriceDisplay price={price} prefix={priceIsStartingFrom ? "From" : undefined} />
      </YStack>
    </Card>
  );
}
