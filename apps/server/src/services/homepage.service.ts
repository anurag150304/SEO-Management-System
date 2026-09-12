import type {
  CreateHomepageInput,
  UpdateHomepageInput,
} from "@repo/zod-validations";
import { CTError } from "@/utils/errHandler.util";
import {
  db,
  desc,
  eq,
  models,
  type HomepageRecord,
  type NewHomepageRecord,
} from "@repo/db-config";

export class HomepageService {
  static async createHomepage(
    data: CreateHomepageInput,
  ): Promise<HomepageRecord> {
    const existing = await this.findLatest();

    if (existing) {
      const updated = await this.update(existing.id, data);
      if (!updated) {
        throw new CTError(400, "Failed to update existing homepage content.");
      }
      return updated;
    }
    const payload = this.buildPayload(data);

    const [record] = await db
      .insert(models.homepage)
      .values(payload)
      .returning();

    if (!record) {
      throw new CTError(
        500,
        "Failed to insert homepage content into database.",
      );
    }

    return record;
  }

  static async getHomepage(id?: number): Promise<HomepageRecord> {
    if (id) {
      const record = await this.findById(id);
      if (!record) {
        throw new CTError(404, `No homepage record found with id: ${id}`);
      }
      return record;
    }

    const latest = await this.findLatest();
    if (!latest) {
      throw new CTError(
        404,
        "Homepage content has not been created yet. Please create homepage content first.",
      );
    }

    return latest;
  }

  static async updateHomepage(
    id: number | undefined,
    data: UpdateHomepageInput,
  ): Promise<HomepageRecord> {
    let targetId = id;

    if (targetId) {
      const existing = await this.findById(targetId);
      if (!existing) {
        throw new CTError(404, `No homepage record found with id: ${targetId}`);
      }
    } else {
      const latest = await this.findLatest();
      if (!latest) {
        throw new CTError(
          404,
          "No homepage record found to update. Please create homepage content first.",
        );
      }
      targetId = latest.id;
    }

    const updated = await this.update(targetId, data);
    if (!updated) {
      throw new CTError(
        400,
        `Failed to update homepage record with id: ${targetId}`,
      );
    }

    return updated;
  }

  private static async findLatest(): Promise<HomepageRecord | null> {
    const [record] = await db
      .select()
      .from(models.homepage)
      .orderBy(desc(models.homepage.id))
      .limit(1);

    return record ?? null;
  }

  private static async findById(id: number): Promise<HomepageRecord | null> {
    const [record] = await db
      .select()
      .from(models.homepage)
      .where(eq(models.homepage.id, id));

    return record ?? null;
  }

  private static async update(
    id: number,
    data: Partial<NewHomepageRecord>,
  ): Promise<HomepageRecord | null> {
    const payload = this.buildPayload(data);

    if (Object.keys(payload).length === 0) {
      return await this.findById(id);
    }

    const [updated] = await db
      .update(models.homepage)
      .set(payload)
      .where(eq(models.homepage.id, id))
      .returning();

    return updated ?? null;
  }

  private static buildPayload(
    fields: Partial<NewHomepageRecord>,
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (fields.heroHeading !== undefined)
      payload.heroHeading = fields.heroHeading;
    if (fields.heroSubheading !== undefined)
      payload.heroSubheading = fields.heroSubheading;
    if (fields.heroImage !== undefined) payload.heroImage = fields.heroImage;
    if (fields.heroCtaText !== undefined)
      payload.heroCtaText = fields.heroCtaText;
    if (fields.heroCtaUrl !== undefined) payload.heroCtaUrl = fields.heroCtaUrl;
    if (fields.aboutTitle !== undefined) payload.aboutTitle = fields.aboutTitle;
    if (fields.aboutDescription !== undefined)
      payload.aboutDescription = fields.aboutDescription;
    if (fields.aboutImage !== undefined) payload.aboutImage = fields.aboutImage;

    return payload;
  }
}
