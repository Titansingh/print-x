import { breakpoints } from "@platform/design-system/tokens";
import { YStack, type YStackProps } from "tamagui";

export type PageContainerProps = YStackProps;

/**
 * Centered, padded content column. Responsive padding on the web; on native
 * the app wraps this with its own safe-area/keyboard handling.
 */
export function PageContainer({ children, ...rest }: PageContainerProps) {
  return (
    <YStack
      width="100%"
      maxW={breakpoints.xl}
      self="center"
      // Tamagui 3 style grammar: media modifiers live inside the value.
      px="4 md:8"
      py="6"
      gap="6"
      {...rest}
    >
      {children}
    </YStack>
  );
}
