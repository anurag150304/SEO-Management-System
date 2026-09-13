import {
  db,
  eq,
  asc,
  desc,
  models,
  type TestimonialRecord,
  type NewTestimonialRecord,
} from "@repo/db-config";
import { DisplayOrderUtil } from "@/utils/displayOrder.util";
import { CTError } from "@/utils/errHandler.util";
import type {
  CreateTestimonialInput,
  UpdateTestimonialInput,
  BatchReorderInput,
} from "@repo/zod-validations";

export class TestimonialService {
  static async createTestimonial(
    data: CreateTestimonialInput,
  ): Promise<TestimonialRecord> {
    return await db.transaction(async (tx) => {
      const maxOrder = await DisplayOrderUtil.getMaxDisplayOrder(
        tx,
        models.testimonials,
      );
      const displayOrder = maxOrder + 1;

      const [record] = await tx
        .insert(models.testimonials)
        .values({
          customerName: data.customerName,
          rating: data.rating,
          review: data.review,
          image: data.image,
          displayOrder,
        })
        .returning();

      if (!record) {
        throw new CTError(500, "Failed to insert testimonial into database.");
      }

      return record;
    });
  }

  static async getAllTestimonials(): Promise<TestimonialRecord[]> {
    return await db
      .select()
      .from(models.testimonials)
      .orderBy(
        asc(models.testimonials.displayOrder),
        desc(models.testimonials.id),
      );
  }

  static async getTestimonialById(id: number): Promise<TestimonialRecord> {
    const [record] = await db
      .select()
      .from(models.testimonials)
      .where(eq(models.testimonials.id, id));

    if (!record) {
      throw new CTError(404, `No testimonial found with id: ${id}`);
    }

    return record;
  }

  static async updateTestimonial(
    id: number,
    data: UpdateTestimonialInput,
  ): Promise<TestimonialRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.testimonials)
        .where(eq(models.testimonials.id, id));

      if (!currentRow) {
        throw new CTError(404, `No testimonial found with id: ${id}`);
      }

      const { displayOrder: requestedOrder, ...otherFields } = data;

      if (
        requestedOrder !== undefined &&
        requestedOrder !== currentRow.displayOrder
      ) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.testimonials,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const payload: Partial<NewTestimonialRecord> = {};
      if (otherFields.customerName !== undefined)
        payload.customerName = otherFields.customerName;
      if (otherFields.rating !== undefined) payload.rating = otherFields.rating;
      if (otherFields.review !== undefined) payload.review = otherFields.review;
      if (otherFields.image !== undefined) payload.image = otherFields.image;
      if (requestedOrder !== undefined) payload.displayOrder = requestedOrder;

      if (Object.keys(payload).length === 0) {
        return currentRow;
      }

      const [updated] = await tx
        .update(models.testimonials)
        .set(payload)
        .where(eq(models.testimonials.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, `Failed to update testimonial with id: ${id}`);
      }

      return updated;
    });
  }

  static async deleteTestimonial(id: number): Promise<TestimonialRecord> {
    return await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(models.testimonials)
        .where(eq(models.testimonials.id, id))
        .returning();

      if (!deleted) {
        throw new CTError(404, `No testimonial found with id: ${id}`);
      }

      await DisplayOrderUtil.shiftOnDelete(
        tx,
        models.testimonials,
        deleted.displayOrder,
      );

      return deleted;
    });
  }

  static async reorderTestimonial(
    id: number,
    requestedOrder: number,
  ): Promise<TestimonialRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.testimonials)
        .where(eq(models.testimonials.id, id));

      if (!currentRow) {
        throw new CTError(404, `No testimonial found with id: ${id}`);
      }

      if (requestedOrder !== currentRow.displayOrder) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.testimonials,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const [updated] = await tx
        .update(models.testimonials)
        .set({ displayOrder: requestedOrder })
        .where(eq(models.testimonials.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, "Failed to update testimonial display order.");
      }

      return updated;
    });
  }

  static async batchReorderTestimonials(
    data: BatchReorderInput,
  ): Promise<TestimonialRecord[]> {
    for (const item of data.orders) {
      await this.reorderTestimonial(item.id, item.displayOrder);
    }

    return await this.getAllTestimonials();
  }
}
