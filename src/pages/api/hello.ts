import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
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
	const query = validate({ schema: QuerySchema, obj: req.query, res })
	if (!query) return

	const search = query.search

	let output: Response = { hello: 'Hello World!' }

	res.status(200).json(output)
}
