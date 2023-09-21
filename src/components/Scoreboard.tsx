import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Button, Card, Divider, Modal, ModalContent } from '@nextui-org/react'
import { request } from 'core/client/api'
import { Player } from 'models/player'
import { Query } from 'pages/api/new-game'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { modalProps } from 'utils/consts'
import { ModalWrapper } from './ModalContent'

export const useScoreboard = ({
	players,
	gameOver,
	roomID,
}: {
	players: Player[]
	gameOver: boolean
	roomID?: string
}): [() => JSX.Element, () => void] => {
	const [newGameAvailable, setNewGameAvailable] = useState(false)
	const [sortedPlayers, setSortedPlayers] = useState<Player[]>([])

	const [opened, setIsOpened] = useState(false)

	const [animationParent] = useAutoAnimate()

	useEffect(() => {
		if (opened)
			setTimeout(() => {
				if (opened) setIsOpened(false)
			}, 7500)
	}, [opened, setIsOpened])

	useEffect(() => {
		if (gameOver) {
			setTimeout(() => setNewGameAvailable(true), 10000)
		}
	}, [gameOver])

	useEffect(() => {
		if (opened || gameOver) {
			setTimeout(
				() => setSortedPlayers(players.sort((a, b) => (a.points > b.points ? 1 : -1))),
				1000
			)
		}
	}, [opened, players, gameOver])

	const [minPoints, maxPoints] = useMemo(() => {
		let minPoints = 9999
		let maxPoints = 0

		players.forEach((p) => {
			if (p.points < minPoints) {
				minPoints = p.points
			}
			if (p.points > maxPoints) {
				maxPoints = p.points
			}
		})

		return [minPoints, maxPoints]
	}, [players])

	const render = useCallback(
		() => (
			<Modal
				{...modalProps}
				size='sm'
				isOpen={opened || gameOver}
				onClose={() => setIsOpened(false)}
			>
				<ModalContent>
					<ModalWrapper>
						<h1 className='text-2xl font-bold'>{gameOver ? 'Final score' : 'Score'}</h1>

						<Divider />

						<ul className='w-full flex flex-col gap-4' ref={animationParent}>
							{sortedPlayers.map((p) => {
								const winner = p.points === minPoints
								const loser = p.points === maxPoints

								let color = winner
									? 'text-primary'
									: loser
									? 'text-red-500'
									: 'text-gray-500'

								let bg: string = ''
								if (gameOver) {
									if (winner || loser) color = 'text-white'

									if (winner) bg = 'bg-primary'
									if (loser) bg = 'bg-red-400'
								}

								return (
									<Card className={bg} key={p.publicID} shadow='lg'>
										<div className='px-4 py-2 flex justify-between items-center'>
											<h4
												className={`truncate font-bold ${color} max-w-[150px]`}
											>
												{p.name}
											</h4>
											<h4 className={`font-bold ${color}`}>{p.points}</h4>
										</div>
									</Card>
								)
							})}
						</ul>

						<Divider />

						{gameOver && (
							<Button
								color='primary'
								isLoading={!newGameAvailable}
								onClick={async () => {
									if (roomID)
										await request<Response, Query, undefined>({
											path: '/new-game',
											query: { room: roomID },
										})
								}}
							>
								Play again
							</Button>
						)}
					</ModalWrapper>
				</ModalContent>
			</Modal>
		),
		[
			opened,
			minPoints,
			maxPoints,
			sortedPlayers,
			animationParent,
			newGameAvailable,
			gameOver,
			roomID,
		]
	)

	return [render, () => setIsOpened(true)]
}
