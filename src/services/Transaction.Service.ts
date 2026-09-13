import ErrorHandler from "../utils/responseHandler/errorHanlder";
import { TTransactionQuery, TTransactionSummaryQuery } from "../schemas/Transaction.Schema";
import TransactionRepository from "../repositories/Transaction.Repository";
import { TProductItem, TTransaction, TTransactionProduct, TTransactyionSummary } from "../dtos/Transaction.dto";
import { DateUtils } from "../utils/Date";
import { TSuccess } from "../dtos/@Base.dto";

export class TransactionService {
	static async create(data: TTransactionQuery, cashierId: number):Promise<TTransaction> {
    if (!data.items || data.items.length === 0) {
      throw ErrorHandler.badRequest("Items array cannot be empty");
    }

    const itemMap = new Map<number, number>();
    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw ErrorHandler.badRequest("Item quantity must be greater than 0");
      }
      const currentQty = itemMap.get(item.product_id) ?? 0;
      itemMap.set(item.product_id, currentQty + item.quantity);
    }

		const uniqueIds = Array.from(itemMap.keys());

		const {username, savedTransaction, items} = await TransactionRepository.create(uniqueIds, itemMap, cashierId, data.phone);

		return ({
			id: savedTransaction.id,
			username: username,
			discountAmount: savedTransaction.discount_amount,
			earnedPoint: savedTransaction.earned_point,
			finalPrice: savedTransaction.final_price,
			totalAmount: savedTransaction.total_amount,
			items: items.map((item):TProductItem => ({
				name: item.name,
				quantity: item.quantity
			}))
		});
	}

	static async summary(data: TTransactionSummaryQuery):Promise<TTransactyionSummary> {
		const { start, end } = DateUtils.parseDateTimeRange(data);

		const transactionItems = await TransactionRepository.summary(start, end, data.productId)

		let totalRevenue = 0;
		let totalItemsSold = 0;

		const productMap = new Map<number, TTransactionProduct>();
		const transactionSet = new Set<number>();

		transactionItems.forEach((item) => {
			if (!item.product) return;

			const lineTotal = Number(item.quantity) * Number(item.priceAtSale);

			totalRevenue += lineTotal;
			totalItemsSold += Number(item.quantity);

			if (item.transaction_id) {
				transactionSet.add(item.transaction_id);
			}

			if (!productMap.has(item.product_id)) {
				productMap.set(item.product_id, {
					productId: item.product_id,
					productName: item.product.name,
					quantity: 0,
					totalAmount: 0,
				});
			}

			const existProduct = productMap.get(item.product_id)!;
			existProduct.quantity += Number(item.quantity);
			existProduct.totalAmount += lineTotal;
		});

		return {
			filter: ({
				start: start ? start : null,
				end: end ? end : null
			}),
			summary: {
				totalRevenue,
				totalItemsSold,
				totalTransactions: transactionSet.size,
			},
			products: Array.from(productMap.values()),
		}
	}

	static async getById(id: number):Promise<TTransaction> {
		const transaction = await TransactionRepository.getById(id)

		if (!transaction) {
			throw ErrorHandler.notFound("transaction not found!!");
		}

		return ({
			id: transaction.id,
			username: transaction.member?.username ?? null,
			discountAmount: transaction.discount_amount,
			earnedPoint: transaction.earned_point,
			finalPrice: transaction.final_price,
			totalAmount: transaction.total_amount,
			items: transaction.items.map((item):TProductItem => ({
				name: item.product.name,
				quantity: item.quantity
			}))
		});
	}

	static async delete( id: number, cashierId: number ):Promise<TSuccess> {
		const success = await TransactionRepository.delete(id, cashierId)

		return success
	}

}





