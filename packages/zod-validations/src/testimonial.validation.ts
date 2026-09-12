import { z } from "zod";
import { hasAtLeastOneField, emptyStringToUndefined } from "./common.validation";

export const createTestimonialSchema = z.object({
  customerName: z
    .string({ error: "Customer name is required." })
    .trim()
    .min(1, "Customer name cannot be empty.")
    .max(256, "Customer name must be no more than 256 characters."),

  rating: z.coerce
    .number({ error: "Rating is required." })
    .int("Rating must be an integer.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot be greater than 5."),

  review: z
    .string({ error: "Review text is required." })
    .trim()
    .min(1, "Review text cannot be empty."),

  image: z.preprocess(
    emptyStringToUndefined,
    z.url({ error: "Customer image must be a valid URL." }).max(500).optional().nullable()
  ),

  displayOrder: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().optional()
  ),
});

export const updateTestimonialSchema = createTestimonialSchema
  .partial()
  .refine(
    (data) => hasAtLeastOneField(data),
    {
      error: "Please provide at least one field to update testimonial details.",
    }
  );

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
