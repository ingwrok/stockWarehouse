import { Between, FindOptionsWhere, In, IsNull } from "typeorm";
import { Transaction } from "../entities/Transaction";
import { TransactionItem } from "../entities/TransactionItem";
import { Product } from "../entities/Product";
import { Member } from "../entities/Member";
import ErrorHandler from "../utils/responseHandler/errorHanlder";

export default class TransactionRepository {
  static async create(uniqueIds: number[], itemMap: Map<number, number>, cashierId: number, phone?: string) {
    return await Transaction.repository().manager.transaction(
      async (transactionalEntityManager) => {
        const products = await transactionalEntityManager.find(Product, {
          where: { id: In(uniqueIds) },
          lock: { mode: "pessimistic_write" },
        });

        if (products.length !== uniqueIds.length) {
          throw ErrorHandler.notFound("Some products not found in the system");
        }

        const productMap = new Map(products.map((p) => [p.id, p]));
        let totalAmount = 0;

        for (const [productId, buyQty] of itemMap.entries()) {
          const product = productMap.get(productId)!;

          if (product.shelf_qty < buyQty) {
            throw ErrorHandler.badRequest(
              `product ${product.name} on shelf (want to buy ${buyQty}, has ${product.shelf_qty})`
            );
          }

          product.shelf_qty -= buyQty;
          product.updated_by = cashierId;

          const price = Number(product.price);
          totalAmount += price * buyQty;
        }

        await transactionalEntityManager.save(Product, products);

        let member: Member | null = null;
        let memberId: number | null = null;
        let discountAmount = 0;
        let earnedPoint = 0;

        if (phone) {
          member = await transactionalEntityManager.findOne(Member, {
            where: { phone },
            lock: { mode: "pessimistic_write" },
          });

          if (member) {
            memberId = member.id;
            discountAmount = member.usePoint();
            earnedPoint = member.addPoint(totalAmount);
            member.updated_by = cashierId;
            await transactionalEntityManager.save(Member, member);
          }
        }

        const finalPrice = Math.max(0, totalAmount - discountAmount);

        const transaction = new Transaction({
          member_id: memberId,
          cashier_id: cashierId,
          discount_amount: discountAmount,
          earned_point: earnedPoint,
          final_price: finalPrice,
          total_amount: totalAmount,
        });

        transaction.created_by = cashierId;
        transaction.updated_by = cashierId;

        const savedTransaction = await transactionalEntityManager.save(Transaction, transaction);

        const transactionItems: (TransactionItem & { name: string })[] = [];

        for (const [productId, buyQty] of itemMap.entries()) {
          const product = productMap.get(productId)!;

          const item = new TransactionItem({
            transaction_id: savedTransaction.id,
            product_id: product.id,
            priceAtSale: product.price,
            quantity: buyQty,
          });

          transactionItems.push(
            Object.assign(item, { name: product.name })
          );
        }

        await transactionalEntityManager.save(TransactionItem, transactionItems);

        return {
          username: member ? member.username : null,
          savedTransaction,
          items: transactionItems
        };
      }
    );
  }

  static async summary(start?: string | null, end?: string | null, product_id?: number | null) {
    const transactionWhere: FindOptionsWhere<Transaction> = {
      deleted_at: IsNull(),
    };

    if (start && end) {
      transactionWhere.created_at = Between(
        start as unknown as Date,
        end as unknown as Date
      );
    }

    const where: FindOptionsWhere<TransactionItem> = {
      transaction: transactionWhere,
    };

    if(product_id){
      where.product_id = product_id
    }

    const transactionItems = await TransactionItem.repository().find({
      where,
      relations: {
        transaction: true,
        product: true,
      },
      withDeleted: true,
      order: {
        product: {
          name: "ASC"
        }
      }
    }) as (TransactionItem & { product: Product })[];

    return transactionItems;
  }

  static async getById(id: number) {
    const transaction = await Transaction.repository()
      .createQueryBuilder(Transaction.table_short_name)
      .leftJoinAndMapMany(
        `${Transaction.table_short_name}.items`,
        TransactionItem,
        "item",
        `item.transaction_id = ${Transaction.table_short_name}.id`
      )
      .leftJoinAndSelect(`${Transaction.table_short_name}.member`, "member")
      .leftJoinAndSelect("item.product", "product")
      .where(`${Transaction.table_short_name}.id = :id`, { id })
      .getOne() as Transaction & { member: Member} & { items: (TransactionItem & { product: Product })[] };

    return transaction ;
  }

  static async delete(id: number, cashierId: number) {
    return await Transaction.datasource.transaction(async (manager) => {
      const transaction = await manager.findOne(Transaction, {
        where: { id },
      });

      if (!transaction) {
        throw ErrorHandler.notFound("Transaction not found");
      }

      const items = await manager.find(TransactionItem, {
        where: { transaction_id: id },
        relations: { product: true },
      });

      for (const item of items) {
        const product = item.product;
        product.shelf_qty += item.quantity;
        product.updated_by = cashierId;
        await manager.save(product);
      }

      if (items.length > 0) {
        await manager.softRemove(items);
      }

      transaction.deleted_by = cashierId;
      await manager.softRemove(transaction);

      return { success: true };
    });
  }

  static async getByMemberId(memberId: number) {
    const transactions = await Transaction.repository()
      .createQueryBuilder(Transaction.table_short_name)
      .leftJoinAndMapMany(
        `${Transaction.table_short_name}.items`,
        TransactionItem,
        "item",
        `item.transaction_id = ${Transaction.table_short_name}.id`
      )
      .leftJoinAndSelect(`${Transaction.table_short_name}.member`, "member")
      .leftJoinAndSelect("item.product", "product")
      .where(`${Transaction.table_short_name}.member_id = :memberId`, { memberId })
      .getMany() as (Transaction & { member: Member} & { items: (TransactionItem & { product: Product })[] })[];

    return transactions ;
  }
}
