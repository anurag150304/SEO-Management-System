import { z } from "zod";
import { hasAtLeastOneField, emptyStringToUndefined } from "./common.validation";

export const createGallerySchema = z.object({
  image: z.preprocess(
    emptyStringToUndefined,
    z.url({ error: "Image must be a valid URL." }).max(500).optional()
  ),

  altText: z
    .string({ error: "Alt text is required for SEO." })
    .trim()
    .min(1, "Alt text cannot be empty.")
    .max(256, "Alt text must be no more than 256 characters."),

  displayOrder: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().optional()
  ),
});

export const updateGallerySchema = createGallerySchema.partial().refine(
  (data) => hasAtLeastOneField(data),
  {
    error: "Please provide at least one field to update gallery image details.",
  }
);

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema>;
