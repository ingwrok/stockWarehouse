import { paramId } from "../schemas/@Base.Schema";
import { ProductController } from "../controller/Product.Controller";
import { productLocationQuerySchema, productQuerySchema, quantitiesItemsQuerySchema, quantityQuerySchema } from "../schemas/Product.Schema";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Authentication } from "../utils/middleware/Auth";

export default (server: FastifyInstance, options: any, done: any) => {
	server.route({
		method: "POST",
		url: "/products",
		preHandler: [Authentication.validate],
		schema: {
			body: productQuerySchema
		},
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await ProductController.create(request, reply);
		},
	});

	server.route({
		method: "GET",
		url: "/products",
		schema: {
			querystring: productLocationQuerySchema
		},
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await ProductController.getProdcuts(request, reply);
		},
	});

	server.route({
		method: "PATCH",
		url: "/products/update-stock-bulk",
		preHandler: [Authentication.validate],
		schema: {
			body: quantitiesItemsQuerySchema
		},
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await ProductController.updateStockBulk(request, reply);
		},
	});

	server.route({
		method: "PATCH",
		url: "/products/:id/add-stock",
		preHandler: [Authentication.validate],
		schema: {
			params: paramId,
			body: quantityQuerySchema
		},
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await ProductController.addStock(request, reply);
		},
	});

	server.route({
		method: "PATCH",
		url: "/products/:id/up-shelf",
		preHandler: [Authentication.validate],
		schema: {
				params: paramId,
				body: quantityQuerySchema
		},
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await ProductController.upShelf(request, reply);
		},
	});

	server.route({
		method: "DELETE",
		url: "/products/:id",
		preHandler: [Authentication.validateAdmin],
		schema: {
			params: paramId,
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await ProductController.delete(request, reply);
		},
	});

	done();
};
