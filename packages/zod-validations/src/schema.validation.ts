import { z } from "zod";
import { idParamValidation } from "./common.validation";

export const SUPPORTED_SCHEMA_TYPES = [
  "ORGANISATION",
  "FAQ",
  "BREADCRUMB",
  "WEBSITE",
  "LOCAL_BUSINESS",
] as const;

export type SupportedSchemaType = (typeof SUPPORTED_SCHEMA_TYPES)[number];

export const schemaTypeEnum = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const normalized = val.trim().toUpperCase();
      if (normalized === "ORGANIZATION") return "ORGANISATION";
      if (normalized === "LOCALBUSINESS") return "LOCAL_BUSINESS";
      return normalized;
    }
    return val;
  },
  z.enum(SUPPORTED_SCHEMA_TYPES, {
    error:
      "schemaType must be one of: ORGANISATION, FAQ, BREADCRUMB, WEBSITE, LOCAL_BUSINESS",
  })
);

export const schemaDataValidation = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  },
  z
    .union([z.record(z.string(), z.any()), z.array(z.any())], {
      error: "schemaData must be a valid JSON object or array.",
    })
    .refine(
      (data) => {
        if (Array.isArray(data)) return data.length > 0;
        if (typeof data === "object" && data !== null) {
          return Object.keys(data).length > 0;
        }
        return false;
      },
      {
        message: "schemaData cannot be empty.",
      }
    )
);

export const createSchemaValidation = z.object({
  schemaType: schemaTypeEnum,
  schemaData: schemaDataValidation,
});

export const updateSchemaValidation = z.object({
  schemaType: schemaTypeEnum.optional(),
  schemaData: schemaDataValidation.optional(),
}).refine((data) => data.schemaType !== undefined || data.schemaData !== undefined,
  {
    message: "At least one field (schemaType or schemaData) must be provided for update.",
  }
);

export const schemaTypeParamValidation = z.object({
  schemaType: schemaTypeEnum,
});

export const schemaIdParamValidation = idParamValidation;

export type CreateSchemaInput = z.infer<typeof createSchemaValidation>;
export type UpdateSchemaInput = z.infer<typeof updateSchemaValidation>;
export type SchemaTypeParamInput = z.infer<typeof schemaTypeParamValidation>;
export type SchemaIdParamInput = z.infer<typeof schemaIdParamValidation>;
