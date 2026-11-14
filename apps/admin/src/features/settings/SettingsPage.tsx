import { Button, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { PageLayout } from "@platform/ui-admin";

/**
 * Form convention: a Zod schema for client-side validation, controlled
 * Mantine inputs, field-level errors, and submission through a TanStack Query
 * mutation once the backend endpoint exists. The backend re-validates.
 */
const supportContactSchema = z.object({
  supportEmail: z.email("Enter a valid email address"),
  supportPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
});

type SupportContact = z.infer<typeof supportContactSchema>;
type FieldErrors = Partial<Record<keyof SupportContact, string>>;

export function SettingsPage() {
  const [values, setValues] = useState<SupportContact>({ supportEmail: "", supportPhone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = supportContactSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SupportContact;
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      setSaved(false);
      return;
    }
    setErrors({});
    setSaved(true);
  }

  return (
    <PageLayout
      title="Settings & roles"
      description="Platform settings and role/permission administration."
    >
      <Paper withBorder radius="md" p="lg" maw={520}>
        <form onSubmit={handleSubmit} noValidate aria-label="Support contact">
          <Stack gap="md">
            <TextInput
              label="Support email"
              type="email"
              value={values.supportEmail}
              onChange={(e) => setValues((v) => ({ ...v, supportEmail: e.currentTarget.value }))}
              error={errors.supportEmail}
              required
            />
            <TextInput
              label="Support phone"
              type="tel"
              value={values.supportPhone}
              onChange={(e) => setValues((v) => ({ ...v, supportPhone: e.currentTarget.value }))}
              error={errors.supportPhone}
              required
            />
            <Button type="submit" w="fit-content">
              Validate
            </Button>
            {saved ? (
              <Text c="green" size="sm" role="status">
                Looks good. Saving is enabled once the settings API is available.
              </Text>
            ) : null}
          </Stack>
        </form>
      </Paper>
    </PageLayout>
  );
}
