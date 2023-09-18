import { useDraggable } from '@dnd-kit/core'
import Image from 'next/image'
import { useCallback, useMemo } from 'react'

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
import styles from './PlayingCard.module.scss'

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

export default function PlayingCard({
	id,
	isInHand,
	isHovering,
	isDisabled,
	isOverlay,
	isDragging,
	isPlayed,
	isPlaying,
}: Props) {
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

	const getContainerStyle = useCallback(
		(size: number): React.CSSProperties => ({
			width: 'fit-content',
			display: 'relative',
			...(isInHand && {
				width: size * handCardVisibleRatio + 'dvh',
				minWidth: size * handCardVisibleRatio + 'dvh',
			}),
			transition: 'transform 100ms ease, border-color 100ms ease',
			zIndex: 1,
			...(!id && {
				opacity: isPlaying ? 0.5 : 0.25,
				border: `2px solid ${
					isPlaying ? `rgba(${highlightColor}, 1)` : 'rgba(255, 255, 255, .25)'
				}`,
				background: isPlaying ? `rgba(${highlightColor}, .25)` : 'rgba(0, 0, 0, .1)',
				borderRadius: 6,
			}),
		}),
		[isInHand, id, isPlaying]
	)

	const getImageStyle = useCallback(
		(size: number): React.CSSProperties => {
			const highlighted = (!isDisabled && isPlaying) || isHovering
			return {
				transition:
					'top 100ms ease, opacity 100ms ease, border-color 100ms ease, min-width 100ms ease',
				position: 'relative',
				pointerEvents: 'none',
				minWidth: size + 'dvh',
				background: highlighted
					? `rgba(${highlightColorBright}, .75)`
					: 'rgba(255, 255, 255, .75)',
				borderRadius: 6,
				border: `2px solid transparent`,
				opacity: !id ? 0 : 1,
				boxShadow:
					(!isDisabled && isPlaying) || isHovering
						? `0 20px 32px -8px rgba(${highlightColorBright}, .25), 0 4px 8px 0 rgba(${highlightColorBright}, .25), 0 6px 20px 0 rgba(${highlightColorBright}, .25)`
						: '0 20px 32px -8px rgba(0, 0, 0, 0.2), 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)',
			}
		},
		[isHovering, id, isPlaying, isDisabled]
	)

	const containerStyle = getContainerStyle(size)
	const imageStyle = getImageStyle(size)

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
							height={size}
							className={styles.Image}
							style={imageStyle}
							alt='Card'
							src={id ? `/assets/cards/${id}.svg` : transparentCard}
						/>
					)}
				</button>
			</div>
		</Client>
	)
}
