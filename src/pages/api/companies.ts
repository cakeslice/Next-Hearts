// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequestTyped } from 'core/server/types'
import { zodObjectKeys, zodQueryStringArray } from 'core/server/zod'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

export const categoryStyle = {
	Excavation: 'bg-orange-300 dark:bg-orange-700',
	Electrical: 'bg-pink-300 dark:bg-pink-700',
	Plumbing: 'bg-cyan-300 dark:bg-cyan-700',
}
export type Category = keyof typeof categoryStyle
export const allCategories = Object.keys(categoryStyle) as Category[]

export type Company = {
	name: string
	logo: string
	categories: Category[]
	city: string
}

//

const [firstCat, ...restCats] = zodObjectKeys(categoryStyle)

const QueryParamsSchema = z.object({
	search: z.optional(z.string()),
	categories: z.optional(zodQueryStringArray(z.enum([firstCat!, ...restCats]))),
})
export type QueryParams = z.infer<typeof QueryParamsSchema>

export type Response =
	| {
			companies: Company[]
	  }
	| undefined

// TODO: Pagination & infinite loading for mobile (with scroll to top on page change) - Middleware

// Next.js endpoints accept all HTTP methods (GET, POST...)
export default function handler(
	req: NextApiRequestTyped<QueryParams, undefined>,
	res: NextApiResponse<Response>
) {
	// TODO: Move to middleware and also .setHeader('message', error...)
	const query = QueryParamsSchema.parse(req.query)
	if (!query) return res.status(400).send(undefined)

	let output: Response = { companies: companies }

	const search = query.search
	if (search)
		output.companies = companies.filter((c) =>
			c.name.toLowerCase().includes(search.toLowerCase())
		)
	console.log(JSON.stringify(query.categories))
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

	res.status(200).json(output)
}

const companies: Company[] = [
	{
		name: 'Construct-X',
		logo: '',
		categories: ['Excavation'],
		city: 'Lisbon',
	},
	{
		name: 'Buildify',
		logo: '',
		categories: ['Electrical', 'Plumbing'],
		city: 'Essen',
	},
	{
		name: 'Meta-Builders',
		logo: '',
		categories: ['Electrical', 'Excavation'],
		city: 'Munich',
	},
	{
		name: 'Brick-by-Brick',
		logo: '',
		categories: ['Plumbing'],
		city: 'Berlin',
	},
]
