import { useDraggable } from '@dnd-kit/core'
import Image from 'next/image'
import { memo, useMemo } from 'react'

import { Card } from 'models/card'
import {
	getCardSize,
	handCardVisibleRatio,
	highlightColor,
	highlightColorBright,
	playedCardSizeRatio,
} from 'utils/consts'
import transparentCard from '../../public/assets/cards/transparent.svg'

import { useBreakpoint } from 'core/client/components/MediaQuery'
import { Client } from 'react-hydration-provider'
import styles from './PlayingCard.module.css'

const cardImageRatio = 78 / 113

type Props = {
	id?: Card | 'back' | 'transparent'
	isInHand?: boolean
	isOverlay?: boolean
	isDragging?: boolean
	isDisabled?: boolean
	isHovering?: boolean
	isPlayed?: boolean
	isPlaying?: boolean
}

const BasePlayingCard = ({
	id,
	isInHand,
	isHovering,
	isDisabled,
	isOverlay,
	isDragging,
	isPlayed,
	isPlaying,
}: Props) => {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: id || 'none',
	})

	const desktop = useBreakpoint('desktop')
	const size = useMemo(
		() =>
			isHovering || isPlayed
				? playedCardSizeRatio * getCardSize(desktop)
				: getCardSize(desktop),
		[isHovering, isPlayed, desktop]
	)

	const buttonStyle: React.CSSProperties = useMemo(
		() => ({
			transition: 'transform 250ms ease',
			...(isDisabled && {
				filter: 'brightness(75%)',
			}),
			...(isPlayed && {
				pointerEvents: 'none',
			}),
		}),
		[isDisabled, isPlayed]
	)

	const containerStyle = useMemo(
		(): React.CSSProperties => ({
			width: 'fit-content',
			display: 'relative',
			transition: 'transform 100ms ease, border-color 100ms ease',
			zIndex: 1,
			...(isInHand && {
				width: size * handCardVisibleRatio + 'dvh',
				minWidth: size * handCardVisibleRatio + 'dvh',
			}),
			...(!id && {
				opacity: isPlaying ? 0.5 : 0.25,
				border: `2px solid ${
					isPlaying ? `rgba(${highlightColor}, 1)` : 'rgba(255, 255, 255, .25)'
				}`,
				background: isPlaying ? `rgba(${highlightColor}, .25)` : 'rgba(0, 0, 0, .1)',
				borderRadius: 6,
			}),
		}),
		[isInHand, id, isPlaying, size]
	)

	const imageStyle = useMemo((): React.CSSProperties => {
		const highlighted = (!isDisabled && isPlaying) || isHovering
		return {
			minWidth: size + 'dvh',
			background: highlighted
				? `rgba(${highlightColorBright}, .75)`
				: 'rgba(255, 255, 255, .75)',
			opacity: !id ? 0 : 1,
			boxShadow:
				(!isDisabled && isPlaying) || isHovering
					? `0 20px 32px -8px rgba(${highlightColorBright}, .25), 0 4px 8px 0 rgba(${highlightColorBright}, .25), 0 6px 20px 0 rgba(${highlightColorBright}, .25)`
					: '0 20px 32px -8px rgba(0, 0, 0, 0.2), 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)',
		}
	}, [isHovering, id, isPlaying, isDisabled, size])

	return (
		<Client>
			<div className={isInHand ? styles.Container : undefined} style={containerStyle}>
				<button
					disabled={isDisabled}
					ref={isOverlay || isDisabled ? undefined : setNodeRef}
					style={buttonStyle}
					{...listeners}
					{...attributes}
				>
					{(!isDragging || isDisabled) && (
						<Image
							width={size}
							height={size / cardImageRatio}
							style={imageStyle}
							className={styles.Image}
							alt='Card'
							src={id ? `/assets/cards/${id}.svg` : transparentCard}
						/>
					)}
				</button>
			</div>
		</Client>
	)
}

export const PlayingCard = memo(BasePlayingCard)
