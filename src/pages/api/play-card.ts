import { socketBroadcast, socketMessage } from 'core/server/socket-io'
import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
import { cardsList } from 'models/card'
import { PlayCardClient, applyFinishedTurn, applyPlayedCard, isValidMove } from 'models/game'
import { getNextPlayer } from 'models/player'
import { getPlayer, getRoom, saveRoom } from 'models/room'
import { NextApiResponse } from 'next'
import { z } from 'zod'

export const QuerySchema = z.object({
	room: z.string(),
})
export type Query = z.infer<typeof QuerySchema>

const BodySchema = z.object({
	card: z.enum(cardsList),
	playerID: z.string(),
})
export type Body = z.infer<typeof BodySchema>

export type Response = {}

export default async function handler(
	req: NextApiRequestTyped<Query, Body>,
	res: NextApiResponse<Response>
) {
	const query = validate({ schema: QuerySchema, obj: req.query, res })
	if (!query) return
	const body = validate({ schema: BodySchema, obj: req.body, res })
	if (!body) return

	const room = getRoom(req.query.room)
	if (!room) {
		return res.status(404).send({})
	}

	const player = getPlayer(room, body.playerID)
	if (!player || !player.isPlaying || !player.id) return res.status(400).send({})

	socketMessage<PlayCardClient>(req, 'kitty', { hello: 'test' })

	if (!isValidMove(body.card, player.hand, room.startingCard, room.isHeartsBroken)) {
		return res.status(400).send({})
	}

	if (!room.startingCard) room.startingCard = body.card

	applyPlayedCard(player, body.card, room)

	const nextPlayer = getNextPlayer(room.players || [], player)

	if (nextPlayer) {
		if (!nextPlayer.playedCard) nextPlayer.isPlaying = true

		saveRoom(room.uniqueLink, room)
		socketBroadcast<PlayCardClient>('update-game', undefined, room.uniqueLink)

		if (nextPlayer.playedCard) {
			applyFinishedTurn(room.uniqueLink)
		}

		let output: Response = {}
		res.status(200).json(output)
	} else {
		return res.status(500).send({})
	}
}
