import { PaginationResponse, getPaginationSchema, paginationSlice } from 'core/server/pagination'
import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
import { Company, companiesData, zodCategories } from 'models/company'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

export const QuerySchema = z
	.object({
		search: z.optional(z.string()),
		categories: zodCategories,
	})
	.and(getPaginationSchema())
export type Query = z.infer<typeof QuerySchema>

export type Response = (
	| {
			companies: Company[]
	  }
	| undefined
) &
	PaginationResponse

export default function handler(req: NextApiRequestTyped<Query>, res: NextApiResponse<Response>) {
	const query = validate({ schema: QuerySchema, obj: req.query, res })
	if (!query) return

	let companies = companiesData

	const search = query.search
	if (search)
		companies = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

	const categories = query.categories || []
	if (categories && categories.length > 0) {
		companies = companies.filter((c) => {
			let found = false

			c.categories.forEach((s) => {
				if (categories.includes(s)) found = true
			})

			return found
		})
	}

	const totalItems = companies.length
	companies = paginationSlice(companies, query)

	res.status(200).json({ companies, totalItems })
}
