import { NextApiRequestTyped } from 'core/server/types'
import { newGame } from 'models/game'
import { getRoom } from 'models/room'
import { NextApiResponse } from 'next'
import { z } from 'zod'

const QueryParamsSchema = z.object({
	room: z.string(),
})
export type QueryParams = z.infer<typeof QueryParamsSchema>

export type Response = {}

export default async function handler(
	req: NextApiRequestTyped<QueryParams, undefined>,
	res: NextApiResponse<Response>
) {
	const query = req.query

	// TODO: Move to middleware and also .setHeader('message', error...)
	if (!QueryParamsSchema.parse(query)) return res.status(400).send({})

	const room = getRoom(req.query.room)
	if (!room) return res.status(404).send({})

	if (!room.gameOver) return res.status(400).send({})

	newGame(query.room)

	let output: Response = {}
	res.status(200).json(output)
}
