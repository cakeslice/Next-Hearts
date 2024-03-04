import { joinSocketRoom, setupSocketEvents } from 'core/server/socket-io'
import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
import { Card } from 'models/card'
import { PlayCardServer } from 'models/game'
import { Player } from 'models/player'
import { getPlayer, getRoom } from 'models/room'
import { NextApiResponse } from 'next'
import { z } from 'zod'

export const QuerySchema = z.object({
	room: z.string().optional(),
})
export type Query = z.infer<typeof QuerySchema>

const BodySchema = z.object({
	playerID: z.string(),
})
export type Body = z.infer<typeof BodySchema>

export type Response =
	| {
			players?: Player[]
			startingCard?: Card
			isHeartsBroken?: boolean
			playerToStartNextTurn?: string
			gameOver?: boolean
	  }
	| undefined

export default function handler(
	req: NextApiRequestTyped<Query, Body>,
	res: NextApiResponse<Response>
) {
	const query = validate({ schema: QuerySchema, obj: req.query, res })
	if (!query) return
	const body = validate({ schema: BodySchema, obj: req.body, res })
	if (!body) return

	if (!query.room) return res.status(404).send(undefined)

	let room = getRoom(query.room)
	if (!room) return res.status(404).send(undefined)

	if (!getPlayer(room, body.playerID)) return res.status(404).send(undefined)

	setupSocketEvents<PlayCardServer>(req, (socket) => {
		socket?.on('hello', (msg) => {
			console.log('hello from client: ' + JSON.stringify(msg))
		})
	})
	joinSocketRoom(req, room.uniqueLink)

	let output: Response = {
		players: room?.players.map((p) =>
			p.id === body.playerID
				? { ...p, isLocal: true }
				: {
						...p,
						// Don't send player ID or their cards to other players
						id: '',
						hand: [],
					}
		),
		startingCard: room?.startingCard,
		isHeartsBroken: room?.isHeartsBroken,
		playerToStartNextTurn: room?.playerToStartNextTurn?.publicID,
		gameOver: room?.gameOver,
	}

	res.status(200).json(output)
}
