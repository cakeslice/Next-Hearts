import NodeCache from 'node-cache'
import { adjectives, animals, colors, names, uniqueNamesGenerator } from 'unique-names-generator'
import { Card } from './card'
import { Player } from './player'

export type Room = {
	players: readonly Player[]
	uniqueLink: string
	deck: readonly Card[]
	startingCard?: Card
	isHeartsBroken?: boolean
	playerToStartNextTurn?: Player
	createdAt: Date
	gameOver?: boolean
}

const cache = new NodeCache()

declare global {
	var cache: NodeCache | undefined
}

if (!global.cache) global.cache = cache

export const addRoom = (idOverride?: string) => {
	const room = {
		players: [],
		deck: [],
		uniqueLink:
			idOverride ||
			uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals, names] }),
		createdAt: new Date(),
	}
	if (global.cache && !global.cache.get(room.uniqueLink)) {
		global.cache.set<Room>(room.uniqueLink, room)
		setTimeout(
			() => {
				console.log('Deleting room ' + room.uniqueLink)
				global.cache?.del(room.uniqueLink)
			},
			1000 * 60 * 60
		)
	}
	return room
}
addRoom('bewildered_apricot_dinosaur_Farand')
export const getRoom = (uniqueLink: string) => {
	return global.cache?.get<Room>(uniqueLink)
}

export const saveRoom = (uniqueLink: string, room: Room): Room => {
	global.cache?.set<Room>(uniqueLink, room)
	return room
}

export const getPlayer = (room: Room, playerID: string) => {
	const player = room.players.find((p) => p.id === playerID)
	return player
}
