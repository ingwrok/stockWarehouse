import z from "zod"

export const transactionQuerySchema = z.object({
  phone: z.string().regex(/^0[0-9]{9}$/).optional(),
  items: z.array(z.object({
    product_id: z.number(),
    quantity: z.number(),
  })).min(1)
})

export const transactionSummaryQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  productId: z.coerce.number().optional()
})

export type TTransactionQuery = z.infer<typeof transactionQuerySchema>;
export type TTransactionSummaryQuery = z.infer<typeof transactionSummaryQuerySchema>