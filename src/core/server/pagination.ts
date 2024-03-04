import { z } from 'zod'

export const getPaginationSchema = (defaultPage = 1, defaultLimit = 10) => {
	return z.object({
		page: z.optional(z.coerce.number()).default(defaultPage),
		limit: z.optional(z.coerce.number()).default(defaultLimit),
	})
}

export type PaginationResponse = {
	totalItems: number
}

export const paginationSlice = (array: any[], { page, limit }: { page: number; limit: number }) =>
	array.slice((page - 1) * limit, (page - 1) * limit + limit)
