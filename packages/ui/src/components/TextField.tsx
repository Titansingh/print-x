import { touchTarget } from "@platform/design-system/tokens";
import { useId } from "react";
import { Input, Label, YStack, type InputProps } from "tamagui";

import { BodyText } from "./Text";

export interface TextFieldProps extends Omit<InputProps, "id"> {
  label: string;
  /** Validation message (e.g. from a Zod schema). Marks the field invalid. */
  error?: string;
  /** Helper text shown when there is no error. */
  hint?: string;
  id?: string;
}

/** Labelled text input with accessible error/hint wiring. */
export function TextField({ label, error, hint, id, disabled, ...inputProps }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? `field-${generatedId}`;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <YStack gap="1.5">
      <Label htmlFor={inputId} color="text">
        {label}
      </Label>
      <Input
        id={inputId}
        minHeight={touchTarget.min}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        borderColor={error ? "error" : "border-color"}
        {...inputProps}
      />
      {message ? (
        <BodyText
          id={messageId}
          size="sm"
          tone={error ? "error" : "muted"}
          aria-live={error ? "polite" : undefined}
        >
          {message}
        </BodyText>
      ) : null}
    </YStack>
  );
}
