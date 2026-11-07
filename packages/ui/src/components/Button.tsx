import { touchTarget } from "@platform/design-system/tokens";
import { Button as TamaguiButton, Spinner, type ButtonProps as TamaguiButtonProps } from "tamagui";

export type ButtonVariant = "primary" | "secondary" | "outlined" | "ghost";

export interface ButtonProps extends Omit<TamaguiButtonProps, "variant" | "theme"> {
  variant?: ButtonVariant;
  /** Shows a spinner, disables interaction and sets aria-busy. */
  loading?: boolean;
}

const variantProps: Record<ButtonVariant, Pick<TamaguiButtonProps, "theme" | "variant">> = {
  // `brand` sub-theme is generated from the shared brand palette.
  primary: { theme: "brand" },
  secondary: {},
  outlined: { variant: "outlined" },
  ghost: { variant: "quiet" },
};

/**
 * Shared customer button. Built on Tamagui's Button, which provides
 * focus-visible outlines, hover/press states and disabled styling. Enforces
 * the platform minimum touch target.
 */
export function Button({
  variant = "primary",
  loading = false,
  disabled,
  icon,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || loading;

  return (
    <TamaguiButton
      {...variantProps[variant]}
      {...rest}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      minHeight={touchTarget.min}
      icon={loading ? <Spinner size="small" color="color" /> : icon}
    >
      {children}
    </TamaguiButton>
  );
}
