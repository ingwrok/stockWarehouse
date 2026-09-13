import { Session } from "../entities/Session";
import { TUser } from "../dtos/User.dto";
import { User } from "../entities/User";
import { TLoginQuery, TRegisterQuery } from "../schemas/User.Schema";
import ErrorHandler from "../utils/responseHandler/errorHanlder";
import bcrypt from "bcrypt";
import { TSuccess } from "../dtos/@Base.dto";

export class AuthService {
	private static readonly SALT_ROUNDS = 10;

	static async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, this.SALT_ROUNDS);
	}

	static async verifyPassword(plainPassword: string, hashedPassword: string):Promise<boolean> {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}

	static async register(data: TRegisterQuery):Promise<TUser> {
		const existingUser = await User.repository().findOne({
			where: {
				username: data.username
			},
		});

		if (existingUser) {
			throw ErrorHandler.badRequest("Username is already taken");
		}

		const hashedPassword = await this.hashPassword(data.password);

		const newUser = new User({
			username: data.username,
			password_hash: hashedPassword,
      role:	data.role
		});

		await newUser.save();

		return ({
			username: newUser.username,
			role: newUser.role
		})
	}

	static async login(data: TLoginQuery, deviceInfo: string):Promise<number> {
		const user = await User.repository().findOne({
			where: { username: data.username },
		});
		if (!user) {
			throw ErrorHandler.badRequest("username or password is not correct");
		}

		const isPasswordCorrect = await this.verifyPassword(
			data.password,
			user.password_hash,
		);
		if (!isPasswordCorrect) {
			throw ErrorHandler.badRequest("username or password is not correct");
		}

		const expiresAtDate = new Date();
		expiresAtDate.setDate(expiresAtDate.getDate() + 1);

		const newSession = new Session({
			user_id: user.id,
			expires_at: expiresAtDate,
			device_info: deviceInfo,
		});

		await newSession.save();

		return newSession.id;
	}

	static async logout(sessionId: number):Promise<void> {
		const result = await Session.repository().delete({ id: sessionId })

		if (!result.affected) {
			throw ErrorHandler.notFound(`sessionId not found`);
		}
	}

	static async logoutAll(userId: number):Promise<void> {

		const result = await Session.repository().delete({ user_id: userId });

		if (!result.affected) {
			throw ErrorHandler.notFound(`sessionId not found`);
		}
	}

}
