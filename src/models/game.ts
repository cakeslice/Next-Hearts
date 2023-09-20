import { isProd } from 'core/env'
import { socketBroadcast } from 'core/server/socket-io'
import { Card, getShuffledCards, sortCards } from 'models/card'
import { Player, getNextPlayer, getPlayerWithHighestCard } from 'models/player'
import { Room, getRoom, saveRoom } from 'models/room'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export type Event =
	| 'card-played'
	| 'round-start'
	| 'turn-over'
	| 'round-over'
	| 'game-over'
	| 'hearts-broken'
	| 'queen-played'
	| 'turn-start'

export interface PlayCardServer extends DefaultEventsMap {
	hello: (msg: { kitty: string }) => void
}
export interface PlayCardClient extends DefaultEventsMap {
	kitty: (msg: { hello: string }) => void
	'update-game': () => void
	'game-event': (event: Event) => void
}

// Game

export const newGame = (roomId: string) => {
	const room = getRoom(roomId)
	if (!room) return

	room.gameOver = false
	const { players } = room
	for (let i = 0; i < players.length; i++) {
		const p = players[i]
		p.points = 0
	}

	saveRoom(room.uniqueLink, room)

	prepareRound(roomId)
}

// Round

export const prepareRound = (roomId: string) => {
	const room = getRoom(roomId)
	if (!room) return

	console.log('Starting new game in room ' + room.uniqueLink)

	room.isHeartsBroken = false
	room.deck = getShuffledCards()

	const DEBUG_END_GAME = false && !isProd

	const { players } = room
	for (let i = 0; i < players.length; i++) {
		const p = players[i]
		p.playedCard = undefined
		p.isPlaying = false
		p.graveyard = []
		p.hand = sortCards(room.deck.slice(i * 13, 13 + i * 13))

		if (DEBUG_END_GAME) p.hand = ['queen_of_spades', '2_of_spades']
	}

	if (DEBUG_END_GAME) players[0].hand = ['queen_of_spades', '2_of_clubs']

	room.startingCard = '2_of_clubs'

	saveRoom(room.uniqueLink, room)

	setTimeout(() => startRound(room.uniqueLink), 750)
	socketBroadcast<PlayCardClient>('update-game', undefined, room.uniqueLink)
	socketBroadcast<PlayCardClient>('game-event', 'round-start', room.uniqueLink)
}
const startRound = (roomId: string) => {
	const room = getRoom(roomId)
	if (!room) return

	const { players } = room
	let startingPlayer = players[0]
	players.forEach((p) => {
		if (p.hand.find((c) => c === '2_of_clubs')) {
			startingPlayer = p
			p.hand = p.hand.filter((c) => c !== '2_of_clubs')
		}
	})

	startingPlayer.playedCard = '2_of_clubs'
	const nextPlayer = getNextPlayer(players, startingPlayer)
	if (nextPlayer) nextPlayer.isPlaying = true

	saveRoom(room.uniqueLink, room)

	socketBroadcast<PlayCardClient>('update-game', undefined, room.uniqueLink)
}

// Turn

type CardType = 'hearts' | 'spades' | 'clubs' | 'diamonds'

export const isValidMove = (
	card: string,
	hand: string[],
	startingCard?: string,
	isHeartsBroken?: boolean
) => {
	if (!hand.find((c) => c === card)) return false

	const cardType = card.split('_')[2] as CardType

	const hasClubs = hand.find((c) => c.includes('_clubs'))
	const hasDiamonds = hand.find((c) => c.includes('_diamonds'))
	const hasSpades = hand.find((c) => c.includes('_spades'))
	const hasHearts = hand.find((c) => c.includes('_hearts'))

	if (!startingCard) {
		return cardType !== 'hearts' || (!hasClubs && !hasDiamonds && !hasSpades) || isHeartsBroken
	}

	const startingCardType = startingCard.split('_')[2] as CardType

	if (cardType === startingCardType) return true

	// Can't play penalty cards on first turn
	if (startingCard === '2_of_clubs' && (cardType === 'hearts' || card === 'queen_of_spades')) {
		return false
	}

	switch (startingCardType) {
		case 'clubs':
			return !hasClubs
		case 'diamonds':
			return !hasDiamonds
		case 'spades':
			return !hasSpades
		case 'hearts':
			return !hasHearts
		default:
			return false
	}
}

export const applyPlayedCard = (player: Player, card: Card, room?: Room) => {
	player.hand = player.hand?.filter((c) => c !== card)
	player.playedCard = card
	player.isPlaying = false

	if (room) {
		const cardType = card?.split('_')[2]

		socketBroadcast<PlayCardClient>('game-event', 'card-played', room.uniqueLink)

		if (cardType === 'hearts' && room && !room.isHeartsBroken) {
			room.isHeartsBroken = true
			socketBroadcast<PlayCardClient>('game-event', 'hearts-broken', room.uniqueLink)
		}
		if (card === 'queen_of_spades')
			socketBroadcast<PlayCardClient>('game-event', 'queen-played', room.uniqueLink)
	}

	return player
}

export const applyFinishedTurn = (roomId: string) => {
	const room = getRoom(roomId)
	if (!room) return

	const { players } = room

	const playerWithHighestCard = getPlayerWithHighestCard(room.players, room.startingCard)

	const turnCards = players.map((p) => p.playedCard) as Card[]

	if (playerWithHighestCard) {
		playerWithHighestCard.graveyard = playerWithHighestCard.graveyard.concat(turnCards)
	} else console.error("Couldn't find player with highest card!")

	room.playerToStartNextTurn = playerWithHighestCard

	saveRoom(room.uniqueLink, room)

	setTimeout(() => {
		socketBroadcast<PlayCardClient>('game-event', 'turn-over', room.uniqueLink)

		setTimeout(() => {
			nextTurn(room.uniqueLink)
		}, 1000)
	}, 2000)
}
export const nextTurn = (roomId: string) => {
	const room = getRoom(roomId)
	if (!room) return

	const { players } = room

	players.forEach((p) => {
		p.playedCard = undefined
		p.isPlaying = false
	})

	room.startingCard = undefined

	if (players[0].hand.length === 0) {
		let playerGotAllPoints: Player
		players.forEach((p) => {
			let points = 0
			p.graveyard.forEach((c) => {
				if (c === 'queen_of_spades') points += 13
				else if (c.includes('of_hearts')) points += 1
			})
			if (points === 26) playerGotAllPoints = p
		})
		players.forEach((p) => {
			if (playerGotAllPoints) {
				if (p !== playerGotAllPoints) p.points += 26

				return
			}

			let points = 0
			p.graveyard.forEach((c) => {
				if (c === 'queen_of_spades') points += 13
				else if (c.includes('of_hearts')) points += 1
			})
			p.points += points
		})

		console.log('Round ended: ' + JSON.stringify(room.players, null, 2))
		socketBroadcast<PlayCardClient>('game-event', 'round-over', room.uniqueLink)

		if (players.find((p) => p.points >= 100)) {
			room.gameOver = true
			console.log('Game ended: ' + JSON.stringify(room.players, null, 2))
			socketBroadcast<PlayCardClient>('game-event', 'game-over', room.uniqueLink)
		} else {
			setTimeout(() => {
				prepareRound(room.uniqueLink)
			}, 7500)
		}
	} else {
		if (room.playerToStartNextTurn) room.playerToStartNextTurn.isPlaying = true
	}

	room.playerToStartNextTurn = undefined

	saveRoom(room.uniqueLink, room)

	socketBroadcast<PlayCardClient>('update-game', undefined, room.uniqueLink)
	socketBroadcast<PlayCardClient>('game-event', 'turn-start', room.uniqueLink)
}
