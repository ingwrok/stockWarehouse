import { RoleUser } from "../entities/User";
import z from "zod";

export const registerQuerySchema = z.object({
	username: z.string(),
	password: z.string(),
	role: z.nativeEnum(RoleUser).default(RoleUser.CASHIER)
});

export const loginQuerySchema = z.object({
	username: z.string(),
	password: z.string(),
});

export type TRegisterQuery = z.infer<typeof registerQuerySchema>;
export type TLoginQuery = z.infer<typeof loginQuerySchema>;