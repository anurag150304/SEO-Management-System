import { z } from "zod";
import {
  hasAtLeastOneField,
  emptyStringToUndefined,
} from "./common.validation";

const homepageBaseFields = {
  heroHeading: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(256, "Hero heading must be no more than 256 characters.")
      .optional()
      .nullable(),
  ),

  heroSubheading: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(256, "Hero subheading must be no more than 256 characters.")
      .optional()
      .nullable(),
  ),

  heroImage: z.preprocess(
    emptyStringToUndefined,
    z
      .url({ error: "Hero image must be a valid URL." })
      .max(500)
      .optional()
      .nullable(),
  ),

  heroCtaText: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(100, "Hero CTA text must be no more than 100 characters.")
      .optional()
      .nullable(),
  ),

  heroCtaUrl: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(500, "Hero CTA URL must be no more than 500 characters.")
      .optional()
      .nullable(),
  ),

  aboutTitle: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(256, "About title must be no more than 256 characters.")
      .optional()
      .nullable(),
  ),

  aboutDescription: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().nullable(),
  ),

  aboutImage: z.preprocess(
    emptyStringToUndefined,
    z
      .url({ error: "About image must be a valid URL." })
      .max(500)
      .optional()
      .nullable(),
  ),
};

export const createHomepageSchema = z
  .object(homepageBaseFields)
  .refine((data) => hasAtLeastOneField(data), {
    error: "Please provide at least one field to create homepage content.",
  });

export const updateHomepageSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    ...homepageBaseFields,
  })
  .refine((data) => hasAtLeastOneField(data, ["id"]), {
    error: "Please provide at least one field to update homepage content.",
  });

export const homepageIdParamValidation = z.object({
  id: z.coerce
    .number({ error: "Invalid homepage ID format." })
    .int({ message: "Homepage ID must be an integer." })
    .positive({ message: "Homepage ID must be a positive integer." }),
});

export type CreateHomepageInput = z.infer<typeof createHomepageSchema>;
export type UpdateHomepageInput = z.infer<typeof updateHomepageSchema>;
export type HomepageIdParamInput = z.infer<typeof homepageIdParamValidation>;
