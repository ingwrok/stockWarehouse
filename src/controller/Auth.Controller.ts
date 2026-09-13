import ErrorHandler from "../utils/responseHandler/errorHanlder";
import { TSuccess } from "../dtos/@Base.dto";
import { TUser } from "../dtos/User.dto";
import { loginQuerySchema, registerQuerySchema } from "../schemas/User.Schema";
import { AuthService } from "../services/Auth.Service";
import { FastifyReply, FastifyRequest } from "fastify";

export class AuthController {
  static async register(request: FastifyRequest, reply: FastifyReply):Promise<TUser> {
    const body = registerQuerySchema.parse(request.body)
    const data = await AuthService.register(body)
    return data
  }

  static async login(request: FastifyRequest, reply: FastifyReply):Promise<TSuccess> {
    const body = loginQuerySchema.parse(request.body)
    const deviceInfo = request.headers['user-agent'] || 'Unknown Device';
    const sessionId = await AuthService.login(body, deviceInfo)

    reply.setCookie('sessionId', sessionId.toString(),{
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    })

    return reply.status(200).send({success: true, message: "Login success"})
  }

  static async logout(request: FastifyRequest, reply: FastifyReply):Promise<TSuccess> {
    const sessionId = request.cookies.sessionId;
    await AuthService.logout(Number(sessionId))
    reply.clearCookie("sessionId", {path:"/"})

    return reply.status(200).send({success: true, message: "Logout success"})
  }

  static async logoutAll(request: FastifyRequest, reply: FastifyReply):Promise<TSuccess> {
    const cashierId = request.user.id
    await AuthService.logoutAll(cashierId);
    reply.clearCookie("sessionId", { path: "/" });

    return reply.status(200).send({ success: true, message: "Logout all success"});
  }

}