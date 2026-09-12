import { z } from "zod";
import {
  hasAtLeastOneField,
  emptyStringToUndefined,
} from "./common.validation";

export const createOccasionSchema = z.object({
  title: z
    .string({ error: "Occasion title is required." })
    .trim()
    .min(1, "Occasion title cannot be empty.")
    .max(256, "Occasion title must be no more than 256 characters."),

  description: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().nullable(),
  ),

  image: z.preprocess(
    emptyStringToUndefined,
    z
      .url({ error: "Image must be a valid URL." })
      .max(500)
      .optional()
      .nullable(),
  ),

  displayOrder: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().optional(),
  ),
});

export const updateOccasionSchema = createOccasionSchema
  .partial()
  .refine((data) => hasAtLeastOneField(data), {
    error: "Please provide at least one field to update occasion details.",
  });

export type CreateOccasionInput = z.infer<typeof createOccasionSchema>;
export type UpdateOccasionInput = z.infer<typeof updateOccasionSchema>;
