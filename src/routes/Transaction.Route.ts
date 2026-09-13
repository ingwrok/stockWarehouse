import { paramId } from "../schemas/@Base.Schema";
import { TransactionController } from "../controller/Transaction.Controller";
import { transactionQuerySchema, transactionSummaryQuerySchema } from "../schemas/Transaction.Schema";
import { Authentication } from "../utils/middleware/Auth";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default (server: FastifyInstance, options: any, done: any) => {
  server.route({
		method: "POST",
		url: "/transactions",
		preHandler: [Authentication.validate],
		schema: {
			body: transactionQuerySchema
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await TransactionController.create(request, reply);
		},
	});

	server.route({
		method: "GET",
		url: "/transactions/summary",
		preHandler: [Authentication.validateAdmin],
		schema: {
			querystring: transactionSummaryQuerySchema
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await TransactionController.summary(request, reply);
		},
	});

	server.route({
		method: "GET",
		url: "/transactions/:id",
		preHandler: [Authentication.validate],
		schema: {
			params: paramId
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await TransactionController.getById(request, reply);
		},

	});

	server.route({
		method: "DELETE",
		url: "/transactions/:id",
		preHandler: [Authentication.validate],
		schema: {
			params: paramId
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await TransactionController.delete(request, reply);
		},
	});

	done();
};
