import { MemberService } from "../services/Member.Service";
import { userQuerySchema } from "../schemas/Member.Schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { TMember } from "../dtos/Member.dto";
import { paramId } from "../schemas/@Base.Schema";
import { TSuccess } from "../dtos/@Base.dto";

export class MemberController {
	static async create( request: FastifyRequest, reply: FastifyReply):Promise<TMember> {
		const cashierId = request.user.id;
    const body = userQuerySchema.parse(request.body)
		const member = await MemberService.create(body, cashierId);
		return reply.status(201).send(member);
	}

	static async getById( request: FastifyRequest, reply: FastifyReply):Promise<TMember> {
		const param = paramId.parse(request.params)
		const member = await MemberService.getById(param.id);
		return member;
	}

	static async delete( request: FastifyRequest, reply: FastifyReply):Promise<TSuccess> {
		const param = paramId.parse(request.params)
		const cashierId = request.user.id;
		const success = await MemberService.delete(param.id, cashierId);
		return success;
	}
}
