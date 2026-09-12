import type {
  createSeoSchemaType,
  updateSeoSchemaType,
} from "@repo/zod-validations";
import { CTError } from "@/utils/errHandler.util";
import { db, desc, eq, models } from "@repo/db-config";

type SEOFields = Omit<updateSeoSchemaType, "seoId">;

function buildSEOPayload({
  metaTitle,
  metaDescription,
  focusKeywords,
  canonicalUrl,
  robotsIndex,
  robotsFollow,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SEOFields) {
  const payload: Record<string, unknown> = {};

  if (metaTitle !== undefined) payload.metaTitle = metaTitle;
  if (metaDescription !== undefined) payload.metaDescription = metaDescription;
  if (focusKeywords !== undefined) payload.focusKeywords = focusKeywords;
  if (canonicalUrl !== undefined) payload.canonicalUrl = canonicalUrl;
  if (robotsIndex !== undefined) payload.robotsIndex = robotsIndex;
  if (robotsFollow !== undefined) payload.robotsFollow = robotsFollow;
  if (ogTitle !== undefined) payload.ogTitle = ogTitle;
  if (ogDescription !== undefined) payload.ogDescription = ogDescription;
  if (ogImage !== undefined) payload.ogImage = ogImage;
  if (twitterTitle !== undefined) payload.twitterTitle = twitterTitle;
  if (twitterDescription !== undefined) payload.twitterDescription = twitterDescription;
  if (twitterImage !== undefined) payload.twitterImage = twitterImage;

  return payload;
}

export class SEOService {
  static async getSEOData(id?: number) {
    if (id) {
      const [seo] = await db
        .select()
        .from(models.seoMetadata)
        .where(eq(models.seoMetadata.id, id));

      if (!seo) {
        throw new CTError(404, `No SEO record found with id: ${id}`);
      }

      return seo;
    }

    const [latest] = await db
      .select()
      .from(models.seoMetadata)
      .orderBy(desc(models.seoMetadata.id))
      .limit(1);

    if (!latest) {
      throw new CTError(404, "SEO metadata has not been configured yet.");
    }

    return latest;
  }

  static async insertSEOData(fields: createSeoSchemaType) {
    const [existing] = await db
      .select()
      .from(models.seoMetadata)
      .orderBy(desc(models.seoMetadata.id))
      .limit(1);

    if (existing) {
      return await this.updateSEOData({ ...fields, seoId: existing.id });
    }

    const payload = buildSEOPayload(fields);

    const [seo] = await db
      .insert(models.seoMetadata)
      .values(payload)
      .returning();

    if (!seo) {
      throw new CTError(500, "Failed to create SEO metadata.");
    }

    return seo;
  }

  static async updateSEOData({ seoId, ...fields }: updateSeoSchemaType) {
    let targetId = seoId;

    if (!targetId) {
      const [latest] = await db
        .select()
        .from(models.seoMetadata)
        .orderBy(desc(models.seoMetadata.id))
        .limit(1);

      if (!latest) {
        throw new CTError(
          404,
          "No SEO metadata record found to update. Please create SEO metadata first."
        );
      }
      targetId = latest.id;
    }

    const payload = buildSEOPayload(fields);

    if (Object.keys(payload).length === 0) {
      return await this.getSEOData(targetId);
    }

    const [data] = await db
      .update(models.seoMetadata)
      .set(payload)
      .where(eq(models.seoMetadata.id, targetId))
      .returning();

    if (!data) {
      throw new CTError(404, `No SEO record found with id: ${targetId}`);
    }

    return data;
  }
}
