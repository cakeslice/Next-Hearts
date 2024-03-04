import { socketBroadcast } from 'core/server/socket-io'
import { NextApiRequestTyped } from 'core/server/types'
import { validate } from 'core/server/zod'
import { PlayCardClient, newGame } from 'models/game'
import { Room, addRoom, getPlayer, getRoom, saveRoom } from 'models/room'
import { NextApiResponse } from 'next'
import { v1 } from 'uuid'
import { z } from 'zod'

const BodySchema = z.object({
	roomID: z.string().optional(),
	playerID: z.string(),
	name: z.string().min(1),
})
export type Body = z.infer<typeof BodySchema>

export type Response = {
	roomID?: string
	error?: string
} | void

const addPlayer = (
	req: NextApiRequestTyped<undefined, Body>,
	room: Room,
	playerID: string,
	name: string
) => {
	if (!getPlayer(room, playerID)) {
		if (room.players.length === 4) return false

		room = saveRoom(room.uniqueLink, {
			...room,
			players: room.players.concat([
				{
					id: playerID,
					publicID: v1(),
					name: name,
					points: 0,
					graveyard: [],
					hand: [],
					seat: room.players.length,
				},
			]),
		})

		console.log('Adding player to room ' + room.uniqueLink + ': ' + name)
		socketBroadcast<PlayCardClient>('update-game', undefined, room.uniqueLink)

		if (room.players.length === 4) {
			newGame(room.uniqueLink)
		}

		return true
	}

	return true
}

export default function handler(
	req: NextApiRequestTyped<undefined, Body>,
	res: NextApiResponse<Response>
) {
	const body = validate({ schema: BodySchema, obj: req.body, res })
	if (!body) return

	const { roomID, playerID, name } = body

	let room: Room | undefined

	let response: Response

	if (roomID) {
		room = getRoom(roomID)
		if (!room) {
			response = { error: 'Room not found' }
			return res.status(404).send(response)
		}

		const success = addPlayer(req, room, playerID, name)
		if (!success) {
			response = { error: 'Room is full' }
			return res.status(400).send(response)
		}
	} else {
		room = addRoom()

		if (!room) {
			response = { error: 'Please try again' }
			return res.status(400).send(response)
		}

		const success = addPlayer(req, room, playerID, name)
		if (!success) return res.status(500).send()
	}

	response = {
		roomID: room?.uniqueLink,
	}
	res.status(200).json(response)
}
