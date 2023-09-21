import { socketBroadcast, socketMessage } from 'core/server/socket-io'
import { NextApiRequestTyped } from 'core/server/types'
import { cardsList } from 'models/card'
import { PlayCardClient, applyFinishedTurn, applyPlayedCard, isValidMove } from 'models/game'
import { getNextPlayer } from 'models/player'
import { getPlayer, getRoom, saveRoom } from 'models/room'
import { NextApiResponse } from 'next'
import { z } from 'zod'

const QuerySchema = z.object({
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
	const query = req.query
	const body = req.body

	// TODO: Move to middleware and also .setHeader('message', error...)
	if (!QuerySchema.parse(query)) return res.status(400).send({})
	if (!BodySchema.parse(body)) return res.status(400).send({})

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
