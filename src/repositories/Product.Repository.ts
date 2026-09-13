import { TQuantitiesItemsQuery } from "../schemas/Product.Schema";
import { Product } from "../entities/Product";
import { FindOptionsWhere, In } from "typeorm";
import ErrorHandler from "../utils/responseHandler/errorHanlder";

export default class ProductRepository{
  static async getProducts(page:number = 1, limit:number = 5, warehouseLocation: string| null | undefined, shelfLocation: string| null | undefined) {
    const where: FindOptionsWhere<Product> = {};
    if(warehouseLocation){
      where.warehouse_location = warehouseLocation;
    }
    if(shelfLocation){
      where.shelf_location = shelfLocation;
    }

    const [items, total] = await Product.repository().findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        updated_at: "DESC"
      }
    })

    return {items, total}
  }

  static async updateStockBulk(items: TQuantitiesItemsQuery, cashierId: number) {
    if (!items || items.length === 0) {
      throw ErrorHandler.badRequest("Items array cannot be empty");
    }

    const itemMap = new Map<number, number>();
    for (const item of items) {
      const currentQty = itemMap.get(item.productId) ?? 0;
      itemMap.set(item.productId, currentQty + item.quantity);
    }

    const uniqueIds = Array.from(itemMap.keys());

    return await Product.repository().manager.transaction(async (transactionalEntityManager) => {
      const existingCount = await transactionalEntityManager.count(Product, {
        where: { id: In(uniqueIds) },
      });

      if (existingCount !== uniqueIds.length) {
        throw ErrorHandler.badRequest("Some product IDs do not exist in the system");
      }

      let caseWarehouse = "CASE id ";
      uniqueIds.forEach((id) => {
        const qty = itemMap.get(id)!;
        caseWarehouse += `WHEN ${Number(id)} THEN warehouse_qty + ${Number(qty)} `;
      });
      caseWarehouse += "END";

      await transactionalEntityManager
        .createQueryBuilder()
        .update(Product)
        .set({
          warehouse_qty: () => caseWarehouse,
          updated_at: () => "NOW()",
          updated_by: cashierId,
        })
        .where("id IN (:...ids)", { ids: uniqueIds })
        .execute();

      const products = await transactionalEntityManager.findBy(Product, {
        id: In(uniqueIds),
      });

      return { products, total: uniqueIds.length };
    });
  }

}