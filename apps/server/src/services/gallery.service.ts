import {
  db,
  eq,
  asc,
  desc,
  models,
  type GalleryRecord,
  type NewGalleryRecord,
} from "@repo/db-config";
import { DisplayOrderUtil } from "@/utils/displayOrder.util";
import { CTError } from "@/utils/errHandler.util";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@repo/zod-validations";
import type { BatchReorderInput } from "@repo/zod-validations";

export class GalleryService {
  static async createGalleryItem(
    data: CreateGalleryInput & { image: string },
  ): Promise<GalleryRecord> {
    if (!data.image) {
      throw new CTError(422, "Gallery image is required.");
    }

    return await db.transaction(async (tx) => {
      // Backend automatically assigns fresh/highest displayOrder
      const maxOrder = await DisplayOrderUtil.getMaxDisplayOrder(
        tx,
        models.gallery,
      );
      const displayOrder = maxOrder + 1;

      const [record] = await tx
        .insert(models.gallery)
        .values({
          image: data.image,
          altText: data.altText,
          displayOrder,
        })
        .returning();

      if (!record) {
        throw new CTError(500, "Failed to insert gallery image into database.");
      }

      return record;
    });
  }

  static async getAllGalleryItems(): Promise<GalleryRecord[]> {
    return await db
      .select()
      .from(models.gallery)
      .orderBy(asc(models.gallery.displayOrder), desc(models.gallery.id));
  }

  static async getGalleryItemById(id: number): Promise<GalleryRecord> {
    const [record] = await db
      .select()
      .from(models.gallery)
      .where(eq(models.gallery.id, id));

    if (!record) {
      throw new CTError(404, `No gallery item found with id: ${id}`);
    }

    return record;
  }

  static async updateGalleryItem(
    id: number,
    data: UpdateGalleryInput,
  ): Promise<GalleryRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.gallery)
        .where(eq(models.gallery.id, id));

      if (!currentRow) {
        throw new CTError(404, `No gallery item found with id: ${id}`);
      }

      const { displayOrder: requestedOrder, ...otherFields } = data;

      if (
        requestedOrder !== undefined &&
        requestedOrder !== currentRow.displayOrder
      ) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.gallery,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const payload: Partial<NewGalleryRecord> = {};
      if (otherFields.image !== undefined) payload.image = otherFields.image;
      if (otherFields.altText !== undefined)
        payload.altText = otherFields.altText;
      if (requestedOrder !== undefined) payload.displayOrder = requestedOrder;

      if (Object.keys(payload).length === 0) {
        return currentRow;
      }

      const [updated] = await tx
        .update(models.gallery)
        .set(payload)
        .where(eq(models.gallery.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, `Failed to update gallery item with id: ${id}`);
      }

      return updated;
    });
  }

  static async deleteGalleryItem(id: number): Promise<GalleryRecord> {
    return await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(models.gallery)
        .where(eq(models.gallery.id, id))
        .returning();

      if (!deleted) {
        throw new CTError(404, `No gallery item found with id: ${id}`);
      }

      await DisplayOrderUtil.shiftOnDelete(
        tx,
        models.gallery,
        deleted.displayOrder,
      );

      return deleted;
    });
  }

  static async reorderGalleryItem(
    id: number,
    requestedOrder: number,
  ): Promise<GalleryRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.gallery)
        .where(eq(models.gallery.id, id));

      if (!currentRow) {
        throw new CTError(404, `No gallery item found with id: ${id}`);
      }

      if (requestedOrder !== currentRow.displayOrder) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.gallery,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const [updated] = await tx
        .update(models.gallery)
        .set({ displayOrder: requestedOrder })
        .where(eq(models.gallery.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, "Failed to update gallery display order.");
      }

      return updated;
    });
  }

  static async batchReorderGallery(
    data: BatchReorderInput,
  ): Promise<GalleryRecord[]> {
    for (const item of data.orders) {
      await this.reorderGalleryItem(item.id, item.displayOrder);
    }

    return await this.getAllGalleryItems();
  }
}
