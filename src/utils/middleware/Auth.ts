import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Session } from "../../entities/Session";
import { User } from "../../entities/User";
import ErrorHandler from "../responseHandler/errorHanlder";

declare module "fastify" {
	interface FastifyRequest {
		user: User;
	}
}

export class Authentication {
	static async validate(request: FastifyRequest, reply: FastifyReply) {
		console.log("checking authorization header ...");

		const sessionId = request.cookies.sessionId;

		if (!sessionId) {
      throw ErrorHandler.unauthorized("Unauthorized: No session cookies")
		}

		const session = await Session.repository().findOne({
			where: { id: Number(sessionId) },
			relations: ["user"],
		});

		if (!session || !session.user) {
      throw ErrorHandler.unauthorized("Invalid session or user not found");
    }

		if (new Date() > session.expires_at) {
      throw ErrorHandler.unauthorized("Session expired")
		}

		console.log(`[Auth] Success: Authenticated User ID ${session.user.id}`);
		request.user = session.user;
	}

	static async validateAdmin(request: FastifyRequest, reply: FastifyReply) {
		console.log("checking authorization header(admin) ...");

		const sessionId = request.cookies.sessionId;

		if (!sessionId) {
      throw ErrorHandler.unauthorized("Unauthorized: No session cookies")
		}

		const session = await Session.repository().findOne({
			where: { id: Number(sessionId) },
			relations: ["user"],
		});

		if (!session || !session.user) {
      throw ErrorHandler.unauthorized("Invalid session or user not found");
    }

		if (new Date() > session.expires_at) {
      throw ErrorHandler.unauthorized("Session expired")
		}

		if (session.user.role !== "ADMIN") {
      throw ErrorHandler.forbidden("Forbidden: Admin access required")
		}

		console.log(`[Auth] Success: Authenticated Admin ID ${session.user.id}`);
		request.user = session.user;
	}
}
