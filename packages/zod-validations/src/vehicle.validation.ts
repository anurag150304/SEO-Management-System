import { z } from "zod";
import {
  idParamValidation,
  singleReorderSchema,
  batchReorderSchema,
  hasAtLeastOneField,
  emptyStringToUndefined,
} from "./common.validation";

export const featuresValidation = z.preprocess(
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
    .array(z.string().min(1, "Feature item cannot be empty."))
    .optional()
    .nullable()
);

export const createVehicleSchema = z.object({
  title: z
    .string({ error: "Vehicle title is required." })
    .trim()
    .min(1, "Vehicle title cannot be empty.")
    .max(256, "Vehicle title must be no more than 256 characters."),

  seatingCapacity: z.preprocess(
    emptyStringToUndefined,
    z.coerce
      .number({ error: "Seating capacity must be a valid number." })
      .int("Seating capacity must be an integer.")
      .positive("Seating capacity must be greater than 0.")
      .max(200, "Seating capacity must be less than 200.")
      .optional()
      .nullable()
  ),

  description: z.preprocess(
    emptyStringToUndefined,
    z.string().optional().nullable()
  ),

  image: z.preprocess(
    emptyStringToUndefined,
    z.url({ error: "Vehicle image must be a valid URL." }).max(500).optional().nullable()
  ),

  features: featuresValidation,

  displayOrder: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().optional()
  ),
});

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .refine(
    (data) => hasAtLeastOneField(data),
    {
      error: "Please provide at least one field to update vehicle details.",
    }
  );

export const vehicleIdParamValidation = idParamValidation;
export const reorderVehicleItemSchema = singleReorderSchema;
export const reorderVehiclesSchema = batchReorderSchema;

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleIdParamInput = z.infer<typeof vehicleIdParamValidation>;
export type ReorderVehicleItemInput = z.infer<typeof reorderVehicleItemSchema>;
export type ReorderVehiclesInput = z.infer<typeof reorderVehiclesSchema>;
