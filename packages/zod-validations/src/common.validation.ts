import { z } from "zod";

export const idParamValidation = z.object({
  id: z.coerce
    .number({ error: "Invalid ID format." })
    .int({ message: "ID must be an integer." })
    .positive({ message: "ID must be a positive integer." }),
});

export const singleReorderSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  displayOrder: z.coerce
    .number({ error: "Display order must be an integer." })
    .int()
    .min(1, "Display order must be at least 1."),
});

export const batchReorderSchema = z.object({
  orders: z
    .array(
      z.object({
        id: z.coerce.number().int().positive(),
        displayOrder: z.coerce.number().int().min(1),
      })
    )
    .min(1, "At least one item is required to reorder."),
});

export const emptyStringToUndefined = (val: unknown) => {
  if (typeof val === "string" && val.trim() === "") return undefined;
  return val;
};

/**
 * Checks if an object contains at least one non-empty value (excluding specified keys).
 */
export function hasAtLeastOneField(
  data: Record<string, unknown>,
  ignoredKeys: string[] = ["id", "seoId", "robotsIndex", "robotsFollow"]
): boolean {
  return Object.entries(data).some(([key, val]) => {
    if (ignoredKeys.includes(key)) return false;
    return val !== undefined && val !== null && val !== "";
  });
}

export type IdParamInput = z.infer<typeof idParamValidation>;
export type SingleReorderInput = z.infer<typeof singleReorderSchema>;
export type BatchReorderInput = z.infer<typeof batchReorderSchema>;
