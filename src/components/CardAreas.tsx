import { memo, useCallback, useMemo } from 'react'

import { CardArea } from 'components/CardArea'

import { Player, PlayerPosition, getNextPlayer, getPreviousPlayer } from 'models/player'
import { Animation, localPlayerArea } from 'pages'

export const CardAreas = memo(function CardAreas({
	players,
	localPlayer,
	animation,
	playerToStartNextTurn,
}: {
	players: Player[]
	localPlayer?: Player
	animation?: Animation
	playerToStartNextTurn?: string
}) {
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
		() => (animation === 'get-cards' ? getPosition(playerToStartNextTurn) : undefined),
		[playerToStartNextTurn, animation, getPosition]
	)

	const animationData = useMemo(
		() => ({
			animation,
			animateToPosition: nextPlayerPosition,
		}),
		[animation, nextPlayerPosition]
	)

	return (
		<>
			<CardArea animationData={animationData} playerData={getPlayer('top')} />
			<CardArea animationData={animationData} playerData={getPlayer('left')} />
			<CardArea animationData={animationData} playerData={getPlayer('right')} />
			<CardArea
				animationData={animationData}
				playerData={getPlayer('bottom')}
				id={localPlayerArea}
			/>
		</>
	)
})
