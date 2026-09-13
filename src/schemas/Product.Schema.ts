import z from "zod";
import { paginationQuerySchema } from "./@Base.Schema";

export const productQuerySchema = z.object({
	name: z.string(),
	warehouseQty: z.number().min(0),
	shelfQty: z.number().min(0),
	warehouseLocation: z.string().min(2),
	shelfLocation: z.string().min(2),
	price: z.number().min(0),
});

export const productLocationQuerySchema = z.object({
	...paginationQuerySchema.shape,
	warehouseLocation: z.string().optional(),
	shelfLocation: z.string().optional(),
})

export const quantityQuerySchema = z.object({
	quantity: z.number().min(0)
})

export const quantitiesItemsQuerySchema = z.array(z.object({
	productId: z.number(),
	quantity: z.number()
}))

export type TProductQuery = z.infer<typeof productQuerySchema>
export type TProductLocationQuery = z.infer<typeof productLocationQuerySchema>
export type TQuantitiesItemsQuery = z.infer<typeof quantitiesItemsQuerySchema>