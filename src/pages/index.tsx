import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	MouseSensor,
	TouchSensor,
	pointerWithin,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { snapCenterToCursor } from '@dnd-kit/modifiers'
import { PageWrapper } from 'components/PageWrapper'
import { PlayingCard } from 'components/PlayingCard'
import { request, useApi, useQueryParams } from 'core/client/api'
import type { NextPage } from 'next'
import { Body as GameBody, Response as GameResponse, Query, QuerySchema } from 'pages/api/game'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'

import { Body as PlayCardBody, Response as PlayCardResponse } from './api/play-card'

import { CardAreas } from 'components/CardAreas'
import { useJoinRoom } from 'components/JoinRoom'
import { PlayerHand } from 'components/PlayerHand'
import { useScoreboard } from 'components/Scoreboard'
import { WaitingForPlayers } from 'components/WaitingForPlayers'
import { useSocketChannel } from 'core/client/socket-io'
import { Card } from 'models/card'
import { Event, PlayCardClient, PlayCardServer, applyPlayedCard } from 'models/game'
import { getPlayerID, getPlayerWithHighestCard } from 'models/player'
import { playSound } from 'utils/client'

export const localPlayerArea = 'player_1_area'

export type Animation = 'get-cards'

const gameEvent = ({
	event,
	setAnimation,
	showScoreboard,
}: {
	event: Event
	setAnimation: Dispatch<SetStateAction<Animation | undefined>>
	showScoreboard: () => void
}) => {
	switch (event) {
		case 'card-played':
			playSound('play')
			return
		case 'turn-over':
			setAnimation('get-cards')
			playSound('turn_end')
			return
		case 'turn-start':
			setAnimation(undefined)
			return
		case 'round-over':
			showScoreboard()
			return
		case 'hearts-broken':
			playSound('break')
			return
		case 'queen-played':
			playSound('secret')
			return
		case 'round-start':
			playSound('got_cards')
			return
	}
}

const Game: NextPage = () => {
	const playerID = useMemo(() => getPlayerID(), [])

	const { query, queryReady } = useQueryParams(QuerySchema)
	const { data, refetch, error } = useApi<GameResponse, Query, GameBody>({
		path: 'game',
		query,
		body: { playerID },
	})
	const players = useMemo(() => data?.players || [], [data?.players])
	const localPlayer = useMemo(() => players.find((p) => p.isLocal), [players])

	const playCard = useCallback(
		async (body: PlayCardBody) => {
			const { result, error } = await request<PlayCardResponse, Query, PlayCardBody>({
				path: 'play-card',
				query: query,
				body: body,
			})
			if (error) alert(error.message)

			return result
		},
		[query]
	)

	//

	const [socket] = useSocketChannel<PlayCardServer, PlayCardClient>({
		connect: () => refetch(),
		kitty: (msg) => console.log('hello from server: ' + JSON.stringify(msg)),
		'update-game': () => refetch(),
		'game-event': (event) => gameEvent({ event, setAnimation, showScoreboard }),
	})

	const [animation, setAnimation] = useState<Animation>()
	const [dragHoverArea, setDragHoverArea] = useState<string>()
	const [draggingCard, setDraggingCard] = useState<Card>()

	const interactive = useMemo(
		() => localPlayer?.isPlaying && !animation,
		[localPlayer, animation]
	)

	const handleDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			if (!interactive) return

			setDraggingCard(undefined)

			if (localPlayer) {
				const willPlayCard = over?.id.toString() === localPlayerArea
				const card = active.id.toString() as Card

				if (willPlayCard && card) {
					const playedCards = (players?.map((p) => p.playedCard).length || 0) + 1
					const playerWithHighestCard =
						playedCards === 4 && data?.startingCard
							? getPlayerWithHighestCard(players, data.startingCard)
							: undefined

					// Update cache with prediction of what the server will send but don't refetch yet
					await refetch(
						{
							...data,
							players: players?.map((p) => {
								if (!p.isLocal) return p

								return applyPlayedCard(p, card)
							}),
							playerToStartNextTurn: playerWithHighestCard?.publicID,
						},
						false
					)

					await playCard({ playerID, card })
				}
			}
		},
		[data, interactive, localPlayer, playCard, playerID, players, refetch]
	)

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

	const [scoreboard, showScoreboard] = useScoreboard({
		players,
		gameOver: !!data?.gameOver,
		roomID: query?.room,
	})

	const [joinRoom, showJoinRoom] = useJoinRoom(
		playerID,
		() => refetch(),
		query?.room,
		players?.length !== 0
	)
	useEffect(() => {
		const create = queryReady && !query?.room
		const join = error
		if (create || join) {
			showJoinRoom()
		}
	}, [error, queryReady, query, showJoinRoom])

	return (
		<PageWrapper>
			{scoreboard()}
			{joinRoom()}
			<WaitingForPlayers roomID={query?.room} players={players} />

			<div className={`select-none${!interactive ? ' pointer-events-none' : ''}`}>
				<DndContext
					collisionDetection={pointerWithin}
					sensors={sensors}
					onDragStart={({ active }: DragStartEvent) => {
						if (!interactive) return

						setDraggingCard(active.id.toString() as Card)
					}}
					onDragEnd={handleDragEnd}
					onDragOver={({ over }: DragOverEvent) => {
						if (!interactive) return

						setDragHoverArea(over?.id.toString())
					}}
				>
					<CardAreas
						players={players}
						localPlayer={localPlayer}
						animation={animation}
						playerToStartNextTurn={data?.playerToStartNextTurn}
					/>

					<PlayerHand
						interactive={interactive}
						localPlayer={localPlayer}
						startingCard={data?.startingCard}
						draggingCard={draggingCard}
						isHeartsBroken={data?.isHeartsBroken}
					/>

					<DragOverlay modifiers={[snapCenterToCursor]}>
						{draggingCard ? (
							<PlayingCard
								isHovering={dragHoverArea === localPlayerArea}
								isOverlay
								key={draggingCard}
								id={draggingCard}
							/>
						) : null}
					</DragOverlay>
				</DndContext>
			</div>
		</PageWrapper>
	)
}

export default Game
