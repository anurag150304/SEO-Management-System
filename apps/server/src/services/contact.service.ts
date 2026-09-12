import {
  db,
  eq,
  desc,
  models,
  type ContactSettingsRecord,
  type NewContactSettingsRecord,
} from "@repo/db-config";
import { CTError } from "@/utils/errHandler.util";
import type {
  CreateContactSettingsInput,
  UpdateContactSettingsInput,
} from "@repo/zod-validations";

export class ContactService {
  static async createContactSettings(
    data: CreateContactSettingsInput,
  ): Promise<ContactSettingsRecord> {
    const existing = await this.findLatest();

    if (existing) {
      return await this.updateContactSettings(existing.id, data);
    }

    const payload = this.buildPayload(data);

    const [record] = await db
      .insert(models.contactSettings)
      .values(payload)
      .returning();

    if (!record) {
      throw new CTError(500, "Failed to save contact settings into database.");
    }

    return record;
  }

  static async getContactSettings(id?: number): Promise<ContactSettingsRecord> {
    if (id) {
      const [record] = await db
        .select()
        .from(models.contactSettings)
        .where(eq(models.contactSettings.id, id));

      if (!record) {
        throw new CTError(404, `No contact settings found with id: ${id}`);
      }

      return record;
    }

    const latest = await this.findLatest();
    if (!latest) {
      throw new CTError(
        404,
        "Contact settings have not been configured yet. Please configure contact settings first.",
      );
    }

    return latest;
  }

  static async updateContactSettings(
    id: number | undefined,
    data: UpdateContactSettingsInput,
  ): Promise<ContactSettingsRecord> {
    let targetId = id;

    if (!targetId) {
      const latest = await this.findLatest();
      if (!latest) {
        throw new CTError(
          404,
          "No contact settings found to update. Please create contact settings first.",
        );
      }
      targetId = latest.id;
    } else {
      const [existing] = await db
        .select()
        .from(models.contactSettings)
        .where(eq(models.contactSettings.id, targetId));

      if (!existing) {
        throw new CTError(
          404,
          `No contact settings found with id: ${targetId}`,
        );
      }
    }

    const payload = this.buildPayload(data);

    if (Object.keys(payload).length === 0) {
      return await this.getContactSettings(targetId);
    }

    const [updated] = await db
      .update(models.contactSettings)
      .set(payload)
      .where(eq(models.contactSettings.id, targetId))
      .returning();

    if (!updated) {
      throw new CTError(
        400,
        `Failed to update contact settings with id: ${targetId}`,
      );
    }

    return updated;
  }

  private static async findLatest(): Promise<ContactSettingsRecord | null> {
    const [latest] = await db
      .select()
      .from(models.contactSettings)
      .orderBy(desc(models.contactSettings.id))
      .limit(1);

    return latest ?? null;
  }

  private static buildPayload(
    fields: Partial<NewContactSettingsRecord>,
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (fields.phone !== undefined) payload.phone = fields.phone;
    if (fields.email !== undefined) payload.email = fields.email;
    if (fields.address !== undefined) payload.address = fields.address;
    if (fields.mapEmbed !== undefined) payload.mapEmbed = fields.mapEmbed;

    return payload;
  }
}
