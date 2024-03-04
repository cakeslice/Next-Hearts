import { NextApiRequestTyped } from 'core/server/types'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

export const QuerySchema = z.object({
	search: z.optional(z.string()),
})
export type Query = z.infer<typeof QuerySchema>

export type Response = {
	hello: string
} | void

export default function handler(req: NextApiRequestTyped<Query>, res: NextApiResponse<Response>) {
	const query = req.query

	if (!QuerySchema.parse(query)) return res.status(400).send()

	const search = query.search

	let output: Response = { hello: 'Hello World!' }

	res.status(200).json(output)
}
