import {
  db,
  eq,
  asc,
  desc,
  models,
  type VehicleRecord,
  type NewVehicleRecord,
} from "@repo/db-config";
import { DisplayOrderUtil } from "@/utils/displayOrder.util";
import { CTError } from "@/utils/errHandler.util";
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  ReorderVehiclesInput,
} from "@/validations/vehicle.validation";

export class VehicleService {
  static async createVehicle(data: CreateVehicleInput): Promise<VehicleRecord> {
    return await db.transaction(async (tx) => {
      // Backend automatically assigns fresh/highest displayOrder
      const maxOrder = await DisplayOrderUtil.getMaxDisplayOrder(
        tx,
        models.vehicles,
      );
      const displayOrder = maxOrder + 1;

      const [record] = await tx
        .insert(models.vehicles)
        .values({
          title: data.title,
          seatingCapacity: data.seatingCapacity,
          description: data.description,
          image: data.image,
          features: data.features,
          displayOrder,
        })
        .returning();

      if (!record) {
        throw new CTError(500, "Failed to insert vehicle into database.");
      }

      return record;
    });
  }

  static async getAllVehicles(): Promise<VehicleRecord[]> {
    return await db
      .select()
      .from(models.vehicles)
      .orderBy(asc(models.vehicles.displayOrder), desc(models.vehicles.id));
  }

  static async getVehicleById(id: number): Promise<VehicleRecord> {
    const [record] = await db
      .select()
      .from(models.vehicles)
      .where(eq(models.vehicles.id, id));

    if (!record) {
      throw new CTError(404, `No vehicle found with id: ${id}`);
    }

    return record;
  }

  static async updateVehicle(
    id: number,
    data: UpdateVehicleInput,
  ): Promise<VehicleRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.vehicles)
        .where(eq(models.vehicles.id, id));

      if (!currentRow) {
        throw new CTError(404, `No vehicle found with id: ${id}`);
      }

      const { displayOrder: requestedOrder, ...otherFields } = data;

      if (
        requestedOrder !== undefined &&
        requestedOrder !== currentRow.displayOrder
      ) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.vehicles,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const payload: Partial<NewVehicleRecord> = {};
      if (otherFields.title !== undefined) payload.title = otherFields.title;
      if (otherFields.seatingCapacity !== undefined)
        payload.seatingCapacity = otherFields.seatingCapacity;
      if (otherFields.description !== undefined)
        payload.description = otherFields.description;
      if (otherFields.image !== undefined) payload.image = otherFields.image;
      if (otherFields.features !== undefined)
        payload.features = otherFields.features;
      if (requestedOrder !== undefined) payload.displayOrder = requestedOrder;

      if (Object.keys(payload).length === 0) {
        return currentRow;
      }

      const [updated] = await tx
        .update(models.vehicles)
        .set(payload)
        .where(eq(models.vehicles.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, `Failed to update vehicle with id: ${id}`);
      }

      return updated;
    });
  }

  static async deleteVehicle(id: number): Promise<VehicleRecord> {
    return await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(models.vehicles)
        .where(eq(models.vehicles.id, id))
        .returning();

      if (!deleted) {
        throw new CTError(404, `No vehicle found with id: ${id}`);
      }

      await DisplayOrderUtil.shiftOnDelete(
        tx,
        models.vehicles,
        deleted.displayOrder,
      );

      return deleted;
    });
  }

  static async reorderVehicle(
    id: number,
    requestedOrder: number,
  ): Promise<VehicleRecord> {
    return await db.transaction(async (tx) => {
      const [currentRow] = await tx
        .select()
        .from(models.vehicles)
        .where(eq(models.vehicles.id, id));

      if (!currentRow) {
        throw new CTError(404, `No vehicle found with id: ${id}`);
      }

      if (requestedOrder !== currentRow.displayOrder) {
        await DisplayOrderUtil.shiftOnReorder(
          tx,
          models.vehicles,
          currentRow.displayOrder,
          requestedOrder,
        );
      }

      const [updated] = await tx
        .update(models.vehicles)
        .set({ displayOrder: requestedOrder })
        .where(eq(models.vehicles.id, id))
        .returning();

      if (!updated) {
        throw new CTError(400, "Failed to update vehicle display order.");
      }

      return updated;
    });
  }

  static async reorderVehicles(
    data: ReorderVehiclesInput,
  ): Promise<VehicleRecord[]> {
    for (const item of data.orders) {
      await this.reorderVehicle(item.id, item.displayOrder);
    }

    return await this.getAllVehicles();
  }
}
