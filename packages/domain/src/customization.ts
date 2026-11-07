import { z } from "zod";

/**
 * Client-side input validation for customization forms. These rules improve
 * UX only; the backend re-validates everything and owns the final limits.
 * Adjust values once the backend publishes its constraints.
 */

// Control characters are not allowed in personalization text.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

export const personalizationTextSchema = z
  .string()
  .trim()
  .min(1, "Enter the text to print")
  .max(40, "Keep it to 40 characters or fewer")
  .refine((value) => !CONTROL_CHARS.test(value), "Remove unsupported characters");

export const photoUploadConstraints = {
  maxBytes: 15 * 1024 * 1024,
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/heic", "image/webp"],
  maxFiles: 5,
} as const;

export const photoSelectionSchema = z.object({
  name: z.string().min(1),
  mimeType: z.enum(photoUploadConstraints.acceptedMimeTypes, {
    error: "Use a JPEG, PNG, HEIC or WebP photo",
  }),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(photoUploadConstraints.maxBytes, "Photos must be 15 MB or smaller"),
});

export const customizationFormSchema = z.object({
  personalizationText: personalizationTextSchema.optional(),
  photos: z
    .array(photoSelectionSchema)
    .max(photoUploadConstraints.maxFiles, "Select up to 5 photos")
    .default([]),
});

export type PhotoSelection = z.infer<typeof photoSelectionSchema>;
export type CustomizationFormInput = z.input<typeof customizationFormSchema>;
export type CustomizationFormValues = z.output<typeof customizationFormSchema>;
