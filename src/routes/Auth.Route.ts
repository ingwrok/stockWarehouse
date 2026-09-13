import { Authentication } from "../utils/middleware/Auth";
import { AuthController } from "../controller/Auth.Controller";
import { loginQuerySchema, registerQuerySchema } from "../schemas/User.Schema";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default (server: FastifyInstance, options: any, done: any) => {
	server.route({
		method: "POST",
		url: "/register",
		schema: {
			body: registerQuerySchema
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await AuthController.register(request, reply);
		},
	});

	server.route({
		method: "POST",
		url: "/login",
		schema: {
			body: loginQuerySchema
		},
		handler: async ( request: FastifyRequest, reply: FastifyReply ) => {
			return await AuthController.login(request, reply);
		},
	});

	server.route({
		method: "POST",
		url: "/logout",
		preHandler: [Authentication.validate],
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await AuthController.logout(request, reply);
		},
	});

	server.route({
		method: "POST",
		url: "/logout-all",
		preHandler: [Authentication.validate],
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			return await AuthController.logoutAll(request, reply);
		},
	});

	done();
};
