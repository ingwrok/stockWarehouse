import z from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10)
});

export const paramId = z.object({
  id: z.coerce.number()
})