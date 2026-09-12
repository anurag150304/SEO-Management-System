import { z } from "zod";
import { hasAtLeastOneField } from "./common.validation";

const emptyStringToUndefined = (val: unknown) => {
  if (typeof val === "string" && val.trim() === "") return undefined;
  return val;
};

const focusKeywordsValidation = z
  .preprocess(
    (val) => {
      if (typeof val === "string") {
        if (val.trim() === "") return undefined;
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      return val;
    },
    z
      .array(z.string().min(1, "Focus keyword cannot be empty."))
      .max(20, "You can add up to 20 focus keywords."),
  )
  .optional()
  .nullable();

const seoBaseFields = {
  metaTitle: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(256, "Meta title must be no more than 256 characters.")
      .optional()
      .nullable(),
  ),

  metaDescription: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().nullable(),
  ),

  focusKeywords: focusKeywordsValidation,

  canonicalUrl: z.preprocess(
    emptyStringToUndefined,
    z
      .url({ error: "Canonical URL must be a valid URL." })
      .max(500)
      .optional()
      .nullable(),
  ),

  robotsIndex: z.preprocess(
    (val) => (typeof val === "string" ? val === "true" || val === "1" : val),
    z.boolean().default(true),
  ),
  robotsFollow: z.preprocess(
    (val) => (typeof val === "string" ? val === "true" || val === "1" : val),
    z.boolean().default(true),
  ),

  ogTitle: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(256, "OG title must be no more than 256 characters.")
      .optional()
      .nullable(),
  ),

  ogDescription: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().nullable(),
  ),

  ogImage: z.preprocess(
    emptyStringToUndefined,
    z
      .url({ error: "OG image must be a valid URL." })
      .max(500)
      .optional()
      .nullable(),
  ),

  twitterTitle: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .max(256, "Twitter title must be no more than 256 characters.")
      .optional()
      .nullable(),
  ),

  twitterDescription: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().nullable(),
  ),

  twitterImage: z.preprocess(
    emptyStringToUndefined,
    z
      .url({ error: "Twitter image must be a valid URL." })
      .max(500)
      .optional()
      .nullable(),
  ),
};

export const createSeoSchema = z
  .object(seoBaseFields)
  .refine((data) => hasAtLeastOneField(data, ["robotsIndex", "robotsFollow"]), {
    error: "Please provide at least one field to create SEO metadata.",
  });

export const updateSeoSchema = z
  .object({
    seoId: z.coerce.number().int().positive().optional(),
    ...seoBaseFields,
  })
  .refine(
    (data) =>
      hasAtLeastOneField(data, ["seoId", "robotsIndex", "robotsFollow"]),
    {
      error: "Please provide at least one field to update SEO metadata.",
    },
  );

export type createSeoSchemaType = z.infer<typeof createSeoSchema>;
export type updateSeoSchemaType = z.infer<typeof updateSeoSchema>;
