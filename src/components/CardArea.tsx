import { useDroppable } from '@dnd-kit/core'
import { useBreakpoint } from 'core/client/components/MediaQuery'
import { Player, PlayerPosition } from 'models/player'
import { Animation } from 'pages'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Client } from 'react-hydration-provider'
import { getCardSize, highlightColorBright, playedCardSizeRatio } from 'utils/consts'
import styles from './CardArea.module.css'
import { PlayingCard } from './PlayingCard'

type Props = {
	id?: string
	playerData: {
		player?: Player
		position: PlayerPosition
	}
	animationData: {
		animation?: Animation
		animateToPosition?: PlayerPosition
	}
}

const seatOffset = 25
const seatOffsetMobile = 15
const cardVerticalOffset = -3
const cardVerticalOffsetMobile = -6

const getRandomRotation = () => Math.random() * 10 * (Math.random() < 0.5 ? -1 : 1)

let queuedAnimation: NodeJS.Timeout | undefined

const BaseCardArea = ({ animationData, playerData, id }: Props) => {
	const { position, player } = playerData
	const { animation, animateToPosition } = animationData

	const { setNodeRef } = useDroppable({
		id: id || position,
	})

	const [randomRotation, setRandomRotation] = useState(0)
	useEffect(() => {
		if (!player?.playedCard && player?.isLocal) setRandomRotation(0)

		if (player?.playedCard && !queuedAnimation)
			queuedAnimation = setTimeout(
				() => {
					setRandomRotation(getRandomRotation())

					queuedAnimation = undefined
				},
				player?.isLocal ? 250 : 0
			)
	}, [player?.playedCard, setRandomRotation, player?.isLocal])

	const gotCards = animation === 'get-cards' && animateToPosition === position

	const getOffset = useCallback(
		(
			desktop: boolean,
			pos: PlayerPosition,
			extraY?: number,
			extraX?: number,
			verticalOnly?: boolean
		) => {
			const offset = desktop ? seatOffset : seatOffsetMobile
			const cardSize = playedCardSizeRatio * getCardSize(desktop)
			return {
				top: `calc(50% - ${cardSize}dvh + ${
					pos === 'bottom' ? offset : pos === 'top' ? -offset : 0
				}dvh + ${extraY || 0}dvh + ${
					desktop ? cardVerticalOffset : cardVerticalOffsetMobile
				}dvh)`,
				...(!verticalOnly && {
					left: `calc(50% - ${cardSize / 2}dvh + ${
						pos === 'right' ? offset : pos === 'left' ? -offset : 0
					}dvh + ${extraX || 0}dvh)`,
				}),
			}
		},
		[]
	)

	const getStyles = useCallback(
		(desktop: boolean) => {
			const baseStyle: React.CSSProperties = {
				position: 'fixed',
				transition:
					'opacity 250ms ease, transform 500ms ease, top 250ms ease, left 250ms ease',
				...getOffset(desktop, position),
			}

			const staticStyle: React.CSSProperties = {
				...baseStyle,
				...(animation && !gotCards && { opacity: 0 }),
			}

			const animatedStyle = {
				...baseStyle,
				transform: `rotateZ(${randomRotation}deg)`,
				opacity: player?.playedCard ? 1 : 0,
				...getOffset(desktop, position, 1, 0, true),
				...(!player?.isLocal &&
					!player?.playedCard && {
						transform: `translate(${
							position === 'left' ? -10 : position === 'right' ? 10 : 0
						}dvh, calc(${
							position === 'top' ? -10 : position === 'bottom' ? 10 : 0
						}dvh) rotateY(45deg) rotateZ(90deg)`,
					}),
				...(animation === 'get-cards' &&
					animateToPosition && {
						...getOffset(
							desktop,
							animateToPosition,
							-1 * (position === 'top' ? 2.5 : position === 'bottom' ? -2.5 : 0) + 4,
							-1 * (position === 'left' ? 5.0 : position === 'right' ? -5.0 : 0)
						),
					}),
			}

			return [staticStyle, animatedStyle]
		},
		[position, animation, animateToPosition, player, gotCards, randomRotation, getOffset]
	)

	const desktop = useBreakpoint('desktop')

	const [staticStyle, animatedStyle] = useMemo(() => getStyles(desktop), [getStyles, desktop])

	const nameStyle = useMemo(
		() => ({
			transition: 'opacity 100ms ease, color 100ms ease',
			maxWidth: '15dvh',
			color: 'white',
			opacity: 0.85,
			...((player?.isPlaying || gotCards) && {
				color: `rgba(${highlightColorBright}, 1)`,
			}),
		}),
		[player?.isPlaying, gotCards]
	)

	return (
		<Client>
			<div>
				<div style={staticStyle}>
					<div className={styles.NameContainer}>
						<p className='text-md truncate font-medium' style={nameStyle}>
							{player?.name}
						</p>
					</div>
					<div ref={setNodeRef}>
						<PlayingCard isPlaying={player?.isPlaying} isPlayed />
					</div>
				</div>
				<div style={animatedStyle}>
					{player?.playedCard && <PlayingCard id={player?.playedCard} isPlayed />}
				</div>
			</div>
		</Client>
	)
}

export const CardArea = memo(BaseCardArea)
