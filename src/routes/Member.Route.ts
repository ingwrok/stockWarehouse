import { paramId } from "../schemas/@Base.Schema";
import { MemberController } from "../controller/Member.Controller";
import { userQuerySchema } from "../schemas/Member.Schema";
import { Authentication } from "../utils/middleware/Auth";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";


export default (server: FastifyInstance, options: any, done: any) => {
  server.route({
		method: "POST",
		url: "/members",
		preHandler: [Authentication.validate],
		schema: {
			body:  userQuerySchema,
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await MemberController.create(request, reply);
		},
	});

	server.route({
		method: "GET",
		url: "/members/history/:id",
		preHandler: [Authentication.validate],
		schema: {
			params: paramId
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await MemberController.history(request, reply);
		},
	});

	server.route({
		method: "GET",
		url: "/members/:id",
		preHandler: [Authentication.validate],
		schema: {
			params: paramId
		},

		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await MemberController.getById(request, reply);
		},
	});

	server.route({
		method: "DELETE",
		url: "/members/:id",
		preHandler: [Authentication.validate],
		schema: {
			params: paramId
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await MemberController.delete(request, reply);
		},
	});

	done();
};
