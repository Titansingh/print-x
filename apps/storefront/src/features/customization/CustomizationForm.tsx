import { personalizationTextSchema } from "@platform/domain";
import { BodyText, Button, TextField } from "@platform/ui";
import { useState, type FormEvent } from "react";
import { YStack } from "tamagui";

export interface CustomizationFormProps {
  /** Called with validated input. Submitting to the backend is not wired yet. */
  onSubmit: (values: { personalizationText: string }) => void;
}

/**
 * Client-side validated personalization input (Zod). The backend re-validates.
 * Photo upload for AI-personalized products uses a platform-specific picker
 * and lands with the uploads API (backend contract pending).
 */
export function CustomizationForm({ onSubmit }: CustomizationFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const result = personalizationTextSchema.safeParse(text);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    onSubmit({ personalizationText: result.data });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Personalize this gift">
      <YStack gap="4">
        <TextField
          label="Text to print"
          value={text}
          onChangeText={setText}
          error={error}
          hint="Up to 40 characters."
          maxLength={60}
        />
        <BodyText tone="muted" size="sm">
          You&apos;ll review a preview before anything is printed.
        </BodyText>
        <Button type="submit" onPress={() => handleSubmit()}>
          Save personalization
        </Button>
      </YStack>
    </form>
  );
}
