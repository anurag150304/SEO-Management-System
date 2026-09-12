import { gt, gte, lt, lte, and, desc, sql } from "@repo/db-config";

// Type representing any Drizzle table with id and displayOrder
interface OrderableTable {
  id: any;
  displayOrder: any;
}

export class DisplayOrderUtil {
  /**
   * Reorders intermediate rows when an item moves from currentOrder to requestedOrder.
   */
  static async shiftOnReorder(
    tx: any,
    table: OrderableTable,
    currentOrder: number,
    requestedOrder: number,
  ): Promise<void> {
    if (requestedOrder === currentOrder) return;

    if (requestedOrder > currentOrder) {
      // Row moved down: shift intermediate rows up by 1 (decrement)
      await tx
        .update(table)
        .set({
          displayOrder: sql`${table.displayOrder} - 1`,
        })
        .where(
          and(
            gt(table.displayOrder, currentOrder),
            lte(table.displayOrder, requestedOrder),
          ),
        );
    } else {
      // Row moved up: shift intermediate rows down by 1 (increment)
      await tx
        .update(table)
        .set({
          displayOrder: sql`${table.displayOrder} + 1`,
        })
        .where(
          and(
            gte(table.displayOrder, requestedOrder),
            lt(table.displayOrder, currentOrder),
          ),
        );
    }
  }

  /**
   * Shifts existing rows at or after requestedOrder up by 1 before inserting a new item.
   */
  static async shiftOnInsert(
    tx: any,
    table: OrderableTable,
    requestedOrder: number,
  ): Promise<void> {
    await tx
      .update(table)
      .set({
        displayOrder: sql`${table.displayOrder} + 1`,
      })
      .where(gte(table.displayOrder, requestedOrder));
  }

  /**
   * Shifts subsequent rows up by 1 (decrement) after deleting an item to close gaps.
   */
  static async shiftOnDelete(
    tx: any,
    table: OrderableTable,
    deletedOrder: number,
  ): Promise<void> {
    await tx
      .update(table)
      .set({
        displayOrder: sql`${table.displayOrder} - 1`,
      })
      .where(gt(table.displayOrder, deletedOrder));
  }

  /**
   * Retrieves the current highest displayOrder in the given table.
   */
  static async getMaxDisplayOrder(
    dbOrTx: any,
    table: OrderableTable,
  ): Promise<number> {
    const [latest] = await dbOrTx
      .select({ displayOrder: table.displayOrder })
      .from(table)
      .orderBy(desc(table.displayOrder))
      .limit(1);

    return latest ? Number(latest.displayOrder) : 0;
  }
}
