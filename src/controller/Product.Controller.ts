import { FastifyReply, FastifyRequest } from "fastify";

import { ProductService } from "../services/Product.Service";
import { productLocationQuerySchema, productQuerySchema, quantitiesItemsQuerySchema, quantityQuerySchema } from "../schemas/Product.Schema";
import { IProducts, TProduct } from "../dtos/Product.dto";
import { IPaginationResponse, TSuccess } from "../dtos/@Base.dto";
import { paramId } from "../schemas/@Base.Schema";

export class ProductController {
	static async create(request: FastifyRequest, reply: FastifyReply):Promise<TProduct> {
		const cashierId = request.user.id;
		const body = productQuerySchema.parse(request.body);
		const data = await ProductService.create(body, cashierId);
		return reply.status(201).send(data);
	}

	static async getProdcuts(request: FastifyRequest, reply: FastifyReply):Promise<IPaginationResponse<TProduct>> {
		const query = productLocationQuerySchema.parse(request.query);
		const {items, total} = await ProductService.getProdcuts(query);

		const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

		return {
			data: items,
			pageInfo:{
				hasNextPage: page < totalPages
			},
		};
	}

	static async updateStockBulk(request: FastifyRequest, reply: FastifyReply):Promise<IProducts> {
		const cashierId = request.user.id
		const query = quantitiesItemsQuerySchema.parse(request.body);

		const products = await ProductService.updateStockBulk(query, cashierId);
		return products;
	}

	static async addStock(request: FastifyRequest, reply: FastifyReply):Promise<TProduct> {
		const cashierId = request.user.id
		const body = quantityQuerySchema.parse(request.body);
		const param = paramId.parse(request.params);

		const data = await ProductService.addStock(param.id, body.quantity, cashierId);

		return data;
	}

	static async upShelf(request: FastifyRequest, reply: FastifyReply):Promise<TProduct> {
		const cashierId = request.user.id
		const body = quantityQuerySchema.parse(request.body);
		const param = paramId.parse(request.params);

		const data = await ProductService.upShelf(param.id, body.quantity, cashierId);

		return data;
	}

	static async delete( request: FastifyRequest, reply: FastifyReply):Promise<TSuccess> {
		const cashierId = request.user.id
		const param = paramId.parse(request.params)
		const success = await ProductService.delete(param.id, cashierId);
		return success;
	}

}
