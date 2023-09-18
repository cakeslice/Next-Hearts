import { NextApiRequestTyped } from 'core/server/types'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

const QueryParamsSchema = z.object({
	search: z.optional(z.string()),
})
export type QueryParams = z.infer<typeof QueryParamsSchema>

export type Response =
	| {
			hello: string
	  }
	| undefined

export default function handler(
	req: NextApiRequestTyped<QueryParams, undefined>,
	res: NextApiResponse<Response>
) {
	const query = req.query

	if (!QueryParamsSchema.parse(query)) return res.status(400).send(undefined)

	const search = query.search

	let output: Response = { hello: 'Hello World!' }

	res.status(200).json(output)
}
