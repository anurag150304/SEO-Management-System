import {
  db,
  eq,
  asc,
  desc,
  models,
  type OccasionRecord,
  type NewOccasionRecord,
} from "@repo/db-config";
import { DisplayOrderUtil } from "@/utils/displayOrder.util";
import { CTError } from "@/utils/errHandler.util";
import type {
  CreateOccasionInput,
  UpdateOccasionInput,
} from "@/validations/occasion.validation";
import type { BatchReorderInput } from "@/validations/common.validation";

export class OccasionService {
  static async createOccasion(
    data: CreateOccasionInput,
  ): Promise<OccasionRecord> {
    return await db.transaction(async (tx) => {
      // Backend automatically assigns fresh/highest displayOrder
      const maxOrder = await DisplayOrderUtil.getMaxDisplayOrder(
        tx,
        models.occasions,
      );
      const displayOrder = maxOrder + 1;

      const [record] = await tx
        .insert(models.occasions)
        .values({
          title: data.title,
          description: data.description,
          image: data.image,
          displayOrder,
        })
        .returning();

      if (!record) {
        throw new CTError(500, "Failed to insert occasion into database.");
      }

      return record;
    });
  }

  static async getAllOccasions(): Promise<OccasionRecord[]> {
    return await db
      .select()
      .from(models.occasions)
      .orderBy(asc(models.occasions.displayOrder), desc(models.occasions.id));
  }

  static async getOccasionById(id: number): Promise<OccasionRecord> {
    const [record] = await db
      .select()
      .from(models.occasions)
      .where(eq(models.occasions.id, id));

    if (!record) {
      throw new CTError(404, `No occasion found with id: ${id}`);
    }

    return record;
  }

  static async updateOccasion(
    id: number,
    data: UpdateOccasionInput,
  ): Promise<OccasionRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.occasions)
        .where(eq(models.occasions.id, id));

      if (!currentRow) {
        throw new CTError(404, `No occasion found with id: ${id}`);
      }

      const { displayOrder: requestedOrder, ...otherFields } = data;

      if (
        requestedOrder !== undefined &&
        requestedOrder !== currentRow.displayOrder
      ) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.occasions,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const payload: Partial<NewOccasionRecord> = {};
      if (otherFields.title !== undefined) payload.title = otherFields.title;
      if (otherFields.description !== undefined)
        payload.description = otherFields.description;
      if (otherFields.image !== undefined) payload.image = otherFields.image;
      if (requestedOrder !== undefined) payload.displayOrder = requestedOrder;

      if (Object.keys(payload).length === 0) {
        return currentRow;
      }

      const [updated] = await tx
        .update(models.occasions)
        .set(payload)
        .where(eq(models.occasions.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, `Failed to update occasion with id: ${id}`);
      }

      return updated;
    });
  }

  static async deleteOccasion(id: number): Promise<OccasionRecord> {
    return await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(models.occasions)
        .where(eq(models.occasions.id, id))
        .returning();

      if (!deleted) {
        throw new CTError(404, `No occasion found with id: ${id}`);
      }

      await DisplayOrderUtil.shiftOnDelete(
        tx,
        models.occasions,
        deleted.displayOrder,
      );

      return deleted;
    });
  }

  static async reorderOccasion(
    id: number,
    requestedOrder: number,
  ): Promise<OccasionRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.occasions)
        .where(eq(models.occasions.id, id));

      if (!currentRow) {
        throw new CTError(404, `No occasion found with id: ${id}`);
      }

      if (requestedOrder !== currentRow.displayOrder) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.occasions,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const [updated] = await tx
        .update(models.occasions)
        .set({ displayOrder: requestedOrder })
        .where(eq(models.occasions.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, "Failed to update occasion display order.");
      }

      return updated;
    });
  }

  static async batchReorderOccasions(
    data: BatchReorderInput,
  ): Promise<OccasionRecord[]> {
    for (const item of data.orders) {
      await this.reorderOccasion(item.id, item.displayOrder);
    }

    return await this.getAllOccasions();
  }
}
