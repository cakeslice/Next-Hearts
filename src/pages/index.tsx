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
import PageWrapper from 'components/PageWrapper'
import PlayingCard from 'components/PlayingCard'
import { request, useApi, useQueryParams } from 'core/client/api'
import type { NextPage } from 'next'
import { Body as GameBody, Response as GameResponse, Query } from 'pages/api/game'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CardArea } from 'components/CardArea'
import { Body as PlayCardBody, Response as PlayCardResponse } from './api/play-card'

import clsx from 'clsx'
import { useJoinRoom } from 'components/JoinRoom'
import { useScoreboard } from 'components/Scoreboard'
import { WaitingForPlayers } from 'components/WaitingForPlayers'
import { useBreakpoint } from 'core/client/components/MediaQuery'
import { useSocketChannel } from 'core/client/socket-io'
import { Card } from 'models/card'
import { PlayCardClient, PlayCardServer, applyPlayedCard, isValidMove } from 'models/game'
import {
	Player,
	PlayerPosition,
	getNextPlayer,
	getPlayerID,
	getPlayerWithHighestCard,
	getPreviousPlayer,
} from 'models/player'
import { Client } from 'react-hydration-provider'
import { playSound } from 'utils/client'
import { getCardSize, handCardVisibleRatio, maxCardsHandRowMobile } from 'utils/consts'
import styles from './index.module.scss'

const localPlayerArea = 'player_1_area'

export type Animation = 'get-cards'

const getCenteredHand = (amount: number, isMobile: boolean) => {
	const s = handCardVisibleRatio * getCardSize(!isMobile)
	return {
		'--hand-container-offset': `${(amount * s) / 2}dvh - ${s}dvh`,
	} as React.CSSProperties
}

const Game: NextPage = () => {
	const playerID = useMemo(() => getPlayerID(), [])

	const { query, queryReady } = useQueryParams<Query>()
	const { data, refetch, error } = useApi<GameResponse, Query, GameBody>([
		'game',
		query,
		{ playerID },
	])
	const players = useMemo(() => data?.players || [], [data?.players])
	const localPlayer = useMemo(() => players.find((p) => p.isLocal), [players])

	const playCard = async (body: PlayCardBody) => {
		const [res, error] = await request<PlayCardResponse, Query, PlayCardBody>({
			path: 'play-card',
			query: query,
			body: body,
		})
		if (error) alert(error.message)

		return res
	}

	//

	const [socket] = useSocketChannel<PlayCardServer, PlayCardClient>({
		connect: () => refetch(),
		kitty: (msg) => console.log('hello from server: ' + JSON.stringify(msg)),
		'update-game': () => refetch(),
		'game-event': (event) => {
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
		},
	})

	const [animation, setAnimation] = useState<Animation>()
	const [dragHoverArea, setDragHoverArea] = useState<string>()
	const [draggingCard, setDraggingCard] = useState<Card>()

	const interactive = useMemo(
		() => localPlayer?.isPlaying && !animation,
		[localPlayer, animation]
	)

	function handleDragStart({ active }: DragStartEvent) {
		if (!interactive) return

		setDraggingCard(active.id.toString() as Card)
	}
	async function handleDragEnd({ active, over }: DragEndEvent) {
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
	}
	function handleDragOver({ over }: DragOverEvent) {
		if (!interactive) return

		setDragHoverArea(over?.id.toString())
	}

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

	const renderHandCard = useCallback(
		(c: Card) => {
			return (
				localPlayer &&
				localPlayer.playedCard !== c && (
					<PlayingCard
						isInHand
						isPlaying={localPlayer.isPlaying && interactive}
						isDisabled={
							!isValidMove(
								c,
								localPlayer.hand,
								data?.startingCard,
								data?.isHeartsBroken
							) &&
							!localPlayer?.playedCard &&
							localPlayer.isPlaying
						}
						isDragging={c === draggingCard}
						key={c}
						id={c}
					/>
				)
			)
		},
		[data, localPlayer, draggingCard, interactive]
	)

	const handOffsetDesktop = useMemo(
		() => getCenteredHand(localPlayer?.hand.length || 0, false),
		[localPlayer?.hand.length]
	)
	const handContainerTopOffsetMobile = useMemo(
		() => getCenteredHand(Math.min(maxCardsHandRowMobile, localPlayer?.hand.length || 0), true),
		[localPlayer?.hand.length]
	)
	const handContainerBottomOffsetMobile = useMemo(
		() => getCenteredHand((localPlayer?.hand.length || 0) - maxCardsHandRowMobile, true),
		[localPlayer?.hand.length]
	)

	const getPlayer = useCallback(
		(position: PlayerPosition) => {
			let p: Player | undefined

			if (position === 'bottom') p = localPlayer
			if (position === 'left') {
				p = getPreviousPlayer(players, localPlayer)
			}
			if (position === 'right') {
				p = getNextPlayer(players, localPlayer)
			}
			if (position === 'top') {
				p = getNextPlayer(players, getNextPlayer(players, localPlayer))
			}

			return {
				position,
				player: p,
			}
		},
		[players, localPlayer]
	)
	const getPosition = useCallback(
		(playerPublicID?: string): PlayerPosition => {
			const player = players.find((p) => p.publicID === playerPublicID)
			const previousPlayer = getPreviousPlayer(players, localPlayer)
			const nextPlayer = getNextPlayer(players, localPlayer)
			if (player === localPlayer) return 'bottom'
			if (player === previousPlayer) {
				return 'left'
			}
			if (player === nextPlayer) {
				return 'right'
			}

			return 'top'
		},
		[players, localPlayer]
	)

	const nextPlayerPosition = useMemo(
		() => (animation === 'get-cards' ? getPosition(data?.playerToStartNextTurn) : undefined),
		[data, animation, getPosition]
	)

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

	const desktop = useBreakpoint('desktop')

	const animationData = useMemo(
		() => ({
			animation,
			animateToPosition: nextPlayerPosition,
		}),
		[animation, nextPlayerPosition]
	)

	return (
		<PageWrapper>
			{scoreboard()}
			{joinRoom()}
			<WaitingForPlayers roomID={query?.room} players={players} />
			<div className={`select-none${!interactive ? ' pointer-events-none' : ''}`}>
				<DndContext
					collisionDetection={pointerWithin}
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					onDragOver={handleDragOver}
				>
					<CardArea animationData={animationData} playerData={getPlayer('top')} />
					<CardArea animationData={animationData} playerData={getPlayer('left')} />
					<CardArea animationData={animationData} playerData={getPlayer('right')} />
					<CardArea
						animationData={animationData}
						playerData={getPlayer('bottom')}
						id={localPlayerArea}
					/>
					<Client>
						{desktop ? (
							<div className={styles.HandContainer} style={handOffsetDesktop}>
								{localPlayer?.hand.map((card) => renderHandCard(card))}
							</div>
						) : (
							<>
								<div
									className={clsx(
										styles.HandContainer,
										styles.HandContainerTopRow
									)}
									style={handContainerTopOffsetMobile}
								>
									{localPlayer?.hand
										?.slice(0, maxCardsHandRowMobile)
										.map((card) => renderHandCard(card))}
								</div>
								<div
									className={clsx(
										styles.HandContainer,
										styles.HandContainerBottomRow
									)}
									style={handContainerBottomOffsetMobile}
								>
									{localPlayer?.hand
										?.slice(maxCardsHandRowMobile)
										.map((card) => renderHandCard(card))}
								</div>
							</>
						)}
					</Client>

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
