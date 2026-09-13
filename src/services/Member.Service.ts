import ErrorHandler from "../utils/responseHandler/errorHanlder";
import { Member } from "../entities/Member";
import { TUserQuery } from "../schemas/Member.Schema";
import { TMember } from "../dtos/Member.dto";
import { TSuccess } from "../dtos/@Base.dto";


export class MemberService {
	static async create(data: TUserQuery, cashierId: number):Promise<TMember> {
		if(await Member.repository().existsBy({phone: data.phone})){
			throw ErrorHandler.badRequest("phone number is already taken!")
		}

		const member = new Member(({
      username: data.name,
      phone: data.phone,
      updated_by: cashierId,
      created_by: cashierId
		}));

    await member.save()

		return ({
      id: member.id,
			username: member.username,
			phone: member.phone,
			points: member.points,
			createdAt: member.created_at
    });
	}

	static async getById(id: number):Promise<TMember> {
		const member = await Member.load(id);

		if (!member) throw ErrorHandler.notFound("Member not found");

		return ({
			id: member.id,
			username: member.username,
			phone: member.phone,
			points: member.points,
			createdAt: member.created_at
		});
	}

	static async delete(id: number, cashierId: number):Promise<TSuccess> {
		const member = await Member.repository().findOne({
			where: { id },
		});

		if (!member) {
			throw ErrorHandler.notFound(`Member with ID ${id} not found`);
		}

		member.deleted_by = cashierId;
		member.updated_by = cashierId;

		await Member.repository().softRemove(member);

		return { success: true };
		}

}
