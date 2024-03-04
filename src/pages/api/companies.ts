import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
import { Company, companiesData, zodCategories } from 'models/company'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

export const QuerySchema = z.object({
	search: z.optional(z.string()),
	categories: zodCategories,
})
export type Query = z.infer<typeof QuerySchema>

export type Response =
	| {
			companies: Company[]
	  }
	| undefined

// TODO: Pagination & infinite loading for mobile (with scroll to top on page change) - Middleware

// Next.js endpoints accept all HTTP methods (GET, POST...)
export default function handler(req: NextApiRequestTyped<Query>, res: NextApiResponse<Response>) {
	const query = validate({ schema: QuerySchema, obj: req.query, res })
	if (!query) return

	let output: Response = { companies: companiesData }

	const search = query.search
	if (search)
		output.companies = output.companies.filter((c) =>
			c.name.toLowerCase().includes(search.toLowerCase())
		)

	const categories = query.categories || []
	if (categories && categories.length > 0) {
		output.companies = output.companies.filter((c) => {
			let found = false

			c.categories.forEach((s) => {
				if (categories.includes(s)) found = true
			})

			return found
		})
	}

	output.companies = output.companies.slice(0, 10)

	res.status(200).json(output)
}
