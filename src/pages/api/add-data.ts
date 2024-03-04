import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
import type { NextApiResponse } from 'next'
import { z } from 'zod'

const BodySchema = z.object({
	hello: z.boolean(),
})
export type Body = z.infer<typeof BodySchema>

export type Response =
	| {
			message: string
	  }
	| undefined

export default function handler(
	req: NextApiRequestTyped<undefined, Body>,
	res: NextApiResponse<Response>
) {
	const body = validate({ schema: BodySchema, obj: req.body, res })
	if (!body) return

	let output: Response = { message: 'Hello World!' }

	res.status(200).json(output)
}
