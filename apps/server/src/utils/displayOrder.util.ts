import { gt, gte, lt, lte, and, desc, sql } from "@repo/db-config";

interface OrderableTable {
  id: any;
  displayOrder: any;
}

export class DisplayOrderUtil {

  static async shiftOnReorder(
    tx: any,
    table: OrderableTable,
    currentOrder: number,
    requestedOrder: number,
  ): Promise<void> {
    if (requestedOrder === currentOrder) return;

    if (requestedOrder > currentOrder) {
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
