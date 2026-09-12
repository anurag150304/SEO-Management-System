import { CTError } from "@/utils/errHandler.util";
import type {
  CreateSchemaInput,
  UpdateSchemaInput,
} from "@repo/zod-validations";
import {
  type SchemaRecord,
  type SchemaEnumType,
  models,
  db,
  DrizzleQueryError,
  desc,
  eq,
} from "@repo/db-config";

async function findById(id: number): Promise<SchemaRecord | null> {
  const [record] = await db
    .select()
    .from(models.schemas)
    .where(eq(models.schemas.id, id));

  return record ?? null;
}

async function findByType(
  schemaType: SchemaEnumType,
): Promise<SchemaRecord | null> {
  const [record] = await db
    .select()
    .from(models.schemas)
    .where(eq(models.schemas.schemaType, schemaType));

  return record ?? null;
}

export class SchemaService {
  static async createSchema(data: CreateSchemaInput): Promise<SchemaRecord> {
    const existing = await findByType(data.schemaType as SchemaEnumType);

    if (existing) {
      // Upsert: update existing schema for this schemaType
      return await this.updateSchemaByType(
        data.schemaType as SchemaEnumType,
        data.schemaData,
      );
    }

    try {
      const [created] = await db
        .insert(models.schemas)
        .values({
          schemaType: data.schemaType as SchemaEnumType,
          schemaData: data.schemaData,
        })
        .returning();

      if (!created) {
        throw new CTError(400, "Failed to create schema record.");
      }

      return created;
    } catch (err) {
      if (
        err instanceof DrizzleQueryError &&
        err.cause &&
        "code" in err.cause &&
        err.cause.code === "23505"
      ) {
        throw new CTError(
          409,
          `Schema of type '${data.schemaType}' already exists.`,
        );
      }
      throw err;
    }
  }

  static async getAllSchemas(): Promise<SchemaRecord[]> {
    return await db
      .select()
      .from(models.schemas)
      .orderBy(desc(models.schemas.createdAt));
  }

  static async getSchemaByType(
    schemaType: SchemaEnumType,
  ): Promise<SchemaRecord> {
    const schema = await findByType(schemaType);
    if (!schema) {
      throw new CTError(404, `No schema found for type: '${schemaType}'`);
    }
    return schema;
  }

  static async updateSchemaByType(
    schemaType: SchemaEnumType,
    schemaData: unknown,
  ): Promise<SchemaRecord> {
    const existing = await findByType(schemaType);

    if (!existing) {
      // If doesn't exist yet, insert fresh record
      const [created] = await db
        .insert(models.schemas)
        .values({
          schemaType,
          schemaData,
        })
        .returning();

      if (!created) {
        throw new CTError(
          400,
          `Failed to create schema for type: '${schemaType}'`,
        );
      }
      return created;
    }

    const [updated] = await db
      .update(models.schemas)
      .set({
        schemaData,
        updatedAt: new Date(),
      })
      .where(eq(models.schemas.schemaType, schemaType))
      .returning();

    if (!updated) {
      throw new CTError(
        400,
        `Failed to update schema for type: '${schemaType}'`,
      );
    }

    return updated;
  }

  static async deleteSchemaByType(
    schemaType: SchemaEnumType,
  ): Promise<SchemaRecord> {
    const existing = await findByType(schemaType);
    if (!existing) {
      throw new CTError(404, `No schema found for type: '${schemaType}'`);
    }

    const [deleted] = await db
      .delete(models.schemas)
      .where(eq(models.schemas.schemaType, schemaType))
      .returning();

    if (!deleted) {
      throw new CTError(
        400,
        `Failed to delete schema for type: '${schemaType}'`,
      );
    }

    return deleted;
  }

  static async getSchemaById(id: number): Promise<SchemaRecord> {
    const schema = await findById(id);
    if (!schema) {
      throw new CTError(404, `No schema record found with id: ${id}`);
    }
    return schema;
  }

  static async updateSchema(
    id: number,
    data: UpdateSchemaInput,
  ): Promise<SchemaRecord> {
    const existing = await findById(id);
    if (!existing) {
      throw new CTError(404, `No schema record found with id: ${id}`);
    }

    const payload: Record<string, unknown> = {};
    if (data.schemaType !== undefined) payload.schemaType = data.schemaType;
    if (data.schemaData !== undefined) payload.schemaData = data.schemaData;

    const [updated] = await db
      .update(models.schemas)
      .set(payload)
      .where(eq(models.schemas.id, id))
      .returning();

    if (!updated) {
      throw new CTError(400, `Failed to update schema record with id: ${id}`);
    }

    return updated;
  }

  static async deleteSchema(id: number): Promise<SchemaRecord> {
    const existing = await findById(id);
    if (!existing) {
      throw new CTError(404, `No schema record found with id: ${id}`);
    }

    const [deleted] = await db
      .delete(models.schemas)
      .where(eq(models.schemas.id, id))
      .returning();

    if (!deleted) {
      throw new CTError(400, `Failed to delete schema record with id: ${id}`);
    }

    return deleted;
  }

  static formatToJsonLd(schema: SchemaRecord): Record<string, unknown> {
    const data = schema.schemaData as Record<string, unknown>;
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      data["@context"]
    ) {
      return data;
    }

    const typeMapping: Record<SchemaEnumType, string> = {
      ORGANISATION: "Organization",
      FAQ: "FAQPage",
      BREADCRUMB: "BreadcrumbList",
      WEBSITE: "WebSite",
      LOCAL_BUSINESS: "LocalBusiness",
    };

    return {
      "@context": "https://schema.org",
      "@type": typeMapping[schema.schemaType] || schema.schemaType,
      ...(typeof data === "object" && data !== null && !Array.isArray(data)
        ? data
        : { items: data }),
    };
  }
}
