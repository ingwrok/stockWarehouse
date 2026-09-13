import { z } from "zod";

export const userQuerySchema = z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^0[0-9]{9}$/),
});

export type TUserQuery = z.infer<typeof userQuerySchema>;
