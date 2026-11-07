import { XStack, YStack, type XStackProps } from "tamagui";

export interface ProductGridProps extends XStackProps {
  children: React.ReactNode;
}

/** Wrapping responsive grid: 2 columns on phones, 3 on tablets, 4 on desktop. */
export function ProductGrid({ children, ...rest }: ProductGridProps) {
  return (
    <XStack flexWrap="wrap" mx="-2" {...rest}>
      {children}
    </XStack>
  );
}

export function ProductGridItem({ children }: { children: React.ReactNode }) {
  return (
    <YStack width="50% md:33.333% lg:25%" p="2">
      {children}
    </YStack>
  );
}
