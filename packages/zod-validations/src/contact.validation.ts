import { z } from "zod";
import { hasAtLeastOneField } from "./common.validation";

const contactBaseFields = {
  phone: z
    .string()
    .max(30, "Phone number must be no more than 30 characters.")
    .optional()
    .nullable(),

  email: z
    .email({ error: "Please enter a valid email address." })
    .max(256, "Email must be no more than 256 characters.")
    .optional()
    .nullable(),

  address: z.string().optional().nullable(),

  mapEmbed: z.string().optional().nullable(),
};

export const createContactSettingsSchema = z
  .object(contactBaseFields)
  .refine((data) => hasAtLeastOneField(data), {
    error: "Please provide at least one field to set contact information.",
  });

export const updateContactSettingsSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    ...contactBaseFields,
  })
  .refine((data) => hasAtLeastOneField(data, ["id"]), {
    error: "Please provide at least one field to update contact information.",
  });

export type CreateContactSettingsInput = z.infer<
  typeof createContactSettingsSchema
>;
export type UpdateContactSettingsInput = z.infer<
  typeof updateContactSettingsSchema
>;
