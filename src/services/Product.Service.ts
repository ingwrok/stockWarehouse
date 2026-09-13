
import { Product } from "../entities/Product";
import { TProductLocationQuery, TProductQuery, TQuantitiesItemsQuery } from "../schemas/Product.Schema";
import ErrorHandler from "../utils/responseHandler/errorHanlder";
import { IProducts, TProduct } from "../dtos/Product.dto";
import ProductRepository from "../repositories/Product.Repository";
import { TSuccess } from "../dtos/@Base.dto";

export interface AddStockItem {
	productId: number;
	quantity: number;
}

export class ProductService {
	static async create( data: TProductQuery, cashierId: number):Promise<TProduct>{
		if (await Product.repository().existsBy({ name: data.name })) {
			throw ErrorHandler.badRequest("Product name already taken");
		}

		if(data.shelfQty < 0 || data.warehouseQty < 0 || data.price < 0){
			throw ErrorHandler.badRequest('quantity or price must more than 0')
		}

		const product = new Product(({
			name: data.name,
			warehouse_qty: data.warehouseQty,
			shelf_qty: data.shelfQty,
			warehouse_location: data.warehouseLocation,
			shelf_location: data.shelfLocation,
			price: data.price,
			created_by: cashierId
		}))

		await product.save()

		return ({
			id: product.id,
			name: product.name,
			warehouseQty: product.warehouse_qty,
			shelfQty: product.shelf_qty,
			warehouseLocation: product.warehouse_location,
			shelfLocation: product.shelf_location,
			price: product.price
		});
	}

	static async getProdcuts(query: TProductLocationQuery):Promise<IProducts> {
		const {page = 1, limit = 5 , warehouseLocation, shelfLocation} = query
		const {items, total} = await ProductRepository.getProducts(page, limit, warehouseLocation, shelfLocation)

		return {
			items: items.map((item):TProduct => ({
				id: item.id,
				name: item.name,
				warehouseQty: item.warehouse_qty,
				shelfQty: item.shelf_qty,
				warehouseLocation: item.warehouse_location,
				shelfLocation: item.shelf_location,
				price: item.price
			})),
			total
		}
	}

	static async updateStockBulk(items: TQuantitiesItemsQuery, cashierId: number):Promise<IProducts> {
		const {products, total} = await ProductRepository.updateStockBulk(items, cashierId)

		return {
			items: products.map((item):TProduct => ({
				id: item.id,
				name: item.name,
				warehouseQty: item.warehouse_qty,
				shelfQty: item.shelf_qty,
				warehouseLocation: item.warehouse_location,
				shelfLocation: item.shelf_location,
				price: item.price
			})),
			total
		}
	}

	static async addStock(productId: number, quantity: number, cashierId: number):Promise<TProduct> {
		const product = await Product.load(productId);

		if (!product) {
			throw ErrorHandler.notFound("product not found");
		}

		product.addStock(quantity);

		product.updated_by = cashierId;
		await product.save();

		return ({
			id: product.id,
			name: product.name,
			warehouseQty: product.warehouse_qty,
			shelfQty: product.shelf_qty,
			warehouseLocation: product.warehouse_location,
			shelfLocation: product.shelf_location,
			price: product.price
		});
	}

	static async upShelf(product_id: number, quantity: number, cashierId: number):Promise<TProduct> {
		const product = await Product.load(product_id);

		if (!product) {
			throw ErrorHandler.notFound("product not found");
		}

		product.upShelf(quantity);

		product.updated_by = cashierId;

		await product.save();

		return ({
			id: product.id,
			name: product.name,
			warehouseQty: product.warehouse_qty,
			shelfQty: product.shelf_qty,
			warehouseLocation: product.warehouse_location,
			shelfLocation: product.shelf_location,
			price: product.price
		});
	}

	static async delete(product_id: number, cashierId: number):Promise<TSuccess>{
		const product = await Product.repository().findOne({
			where: { id: product_id },
		});

		if (!product) {
			throw ErrorHandler.notFound(`Product with not found`);
		}

		product.deleted_by = cashierId;
		product.updated_by = cashierId;

		await Product.repository().softRemove(product);

  	return { success: true };
	}

}
