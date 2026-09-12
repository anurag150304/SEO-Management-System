import type { Request, Response } from "express";
import {
  createSchemaValidation,
  updateSchemaValidation,
  schemaTypeParamValidation,
  schemaIdParamValidation,
  schemaDataValidation,
} from "@repo/zod-validations";
import { SchemaService } from "@/services/schema.service";
import { formatZodErrors } from "@/utils/zodErrors";

export class SchemaController {
  static async createSchema(req: Request, res: Response) {
    const parsedData = createSchemaValidation.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(422).json({
        errors: formatZodErrors(parsedData.error),
      });
    }

    const schema = await SchemaService.createSchema(parsedData.data);

    return res.status(201).json({
      message: "Schema created successfully",
      schema,
    });
  }

  static async getAllSchemas(_req: Request, res: Response) {
    const schemas = await SchemaService.getAllSchemas();

    return res.status(200).json({
      message: "Schemas fetched successfully",
      count: schemas.length,
      schemas,
    });
  }

  static async getSchema(req: Request, res: Response) {
    const rawParam = req.params?.schemaType ?? req.params?.id;

    // First try parsing as schemaType
    const parsedType = schemaTypeParamValidation.safeParse({
      schemaType: rawParam,
    });

    if (parsedType.success) {
      const schema = await SchemaService.getSchemaByType(
        parsedType.data.schemaType as any,
      );
      return res.status(200).json({
        message: "Schema fetched successfully",
        schema,
      });
    }

    // Otherwise check if numeric ID
    const parsedId = schemaIdParamValidation.safeParse({ id: rawParam });
    if (parsedId.success) {
      const schema = await SchemaService.getSchemaById(parsedId.data.id);
      return res.status(200).json({
        message: "Schema fetched successfully",
        schema,
      });
    }

    return res.status(422).json({
      errors: formatZodErrors(parsedType.error),
    });
  }

  static async updateSchema(req: Request, res: Response) {
    const rawParam = req.params?.schemaType ?? req.params?.id;

    // Check if schemaType
    const parsedType = schemaTypeParamValidation.safeParse({
      schemaType: rawParam,
    });

    if (parsedType.success) {
      // Validate schemaData
      const rawData =
        req.body?.schemaData !== undefined ? req.body.schemaData : req.body;
      const parsedData = schemaDataValidation.safeParse(rawData);

      if (!parsedData.success) {
        return res.status(422).json({
          errors: formatZodErrors(parsedData.error),
        });
      }

      const schema = await SchemaService.updateSchemaByType(
        parsedType.data.schemaType as any,
        parsedData.data,
      );

      return res.status(200).json({
        message: "Schema updated successfully",
        schema,
      });
    }

    // Check if numeric ID
    const parsedId = schemaIdParamValidation.safeParse({ id: rawParam });
    if (parsedId.success) {
      const parsedData = updateSchemaValidation.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(422).json({
          errors: formatZodErrors(parsedData.error),
        });
      }

      const schema = await SchemaService.updateSchema(
        parsedId.data.id,
        parsedData.data,
      );

      return res.status(200).json({
        message: "Schema updated successfully",
        schema,
      });
    }

    return res.status(422).json({
      errors: formatZodErrors(parsedType.error),
    });
  }

  static async deleteSchema(req: Request, res: Response) {
    const rawParam = req.params?.schemaType ?? req.params?.id;

    // Check if schemaType
    const parsedType = schemaTypeParamValidation.safeParse({
      schemaType: rawParam,
    });

    if (parsedType.success) {
      const deleted = await SchemaService.deleteSchemaByType(
        parsedType.data.schemaType as any,
      );
      return res.status(200).json({
        message: "Schema deleted successfully",
        schemaType: deleted.schemaType,
      });
    }

    // Check if numeric ID
    const parsedId = schemaIdParamValidation.safeParse({ id: rawParam });
    if (parsedId.success) {
      const deleted = await SchemaService.deleteSchema(parsedId.data.id);
      return res.status(200).json({
        message: "Schema deleted successfully",
        schemaId: deleted.id,
      });
    }

    return res.status(422).json({
      errors: formatZodErrors(parsedType.error),
    });
  }
}
