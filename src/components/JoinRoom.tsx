import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './JoinRoom.module.scss'

import { Button, Input, Modal, ModalContent, Spacer } from '@nextui-org/react'
import { title } from 'config'
import { request } from 'core/client/api'
import { Body, Response } from 'pages/api/join-game'
import { modalProps } from 'utils/consts'
import card2 from '../../public/assets/cards/ace_of_hearts.svg'
import card1 from '../../public/assets/cards/queen_of_spades.svg'
import { ModalWrapper } from './ModalContent'

const Logo = () => {
	const size = 80
	return (
		<div className='flex'>
			<div
				style={{
					width: 20,
				}}
			>
				<Image
					className={styles.Card1}
					style={{
						minWidth: size,
						width: size,
						boxShadow:
							'0 20px 32px -8px rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.05)',
					}}
					alt='Card'
					src={card1}
				/>
			</div>

			<Image
				className={styles.Card2}
				style={{
					width: size,
					position: 'relative',
					left: 10,
					boxShadow:
						'0 20px 32px -8px rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 20px 0 rgba(0, 0, 0, 0.05)',
				}}
				alt='Card'
				src={card2}
			/>
		</div>
	)
}

export const useJoinRoom = (
	playerID: string,
	refetch: () => void,
	roomID?: string,
	forceClosed?: boolean
): [() => JSX.Element, () => void] => {
	const [error, setError] = useState<string>()
	const [opened, setIsOpened] = useState(false)

	const router = useRouter()

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<{ name: string }>()

	const render = useCallback(
		() => (
			<Modal
				{...modalProps}
				size='xs'
				isOpen={opened && !forceClosed}
				onClose={() => setIsOpened(false)}
			>
				<ModalContent>
					<form
						onSubmit={handleSubmit(async (values) => {
							const [res] = await request<Response, undefined, Body>({
								path: '/join-game',
								body: {
									playerID,
									roomID,
									name: values.name,
								},
							})
							if (res?.roomID) {
								router.push('/?room=' + res.roomID)
								refetch()
								close()
							} else {
								router.push('/')
								setError(res?.error || 'Something went wrong')
							}
						})}
					>
						<ModalWrapper>
							<Spacer y={1} />

							<Logo />

							<h1 className='text-3xl font-bold'>{title}</h1>

							<Spacer y={3} />

							<Input
								{...register('name', {
									required: '*',
								})}
								autoFocus
								required
								isInvalid={!!errors.name}
								variant='bordered'
								maxLength={20}
								className='w-full'
								placeholder='Your name'
							/>

							<Button color='primary' fullWidth type='submit'>
								{!roomID ? 'Create room' : 'Join room'}
							</Button>

							<p className='text-sm font-semibold text-red-500' color='red'>
								{error}
							</p>
						</ModalWrapper>
					</form>
				</ModalContent>
			</Modal>
		),
		[
			opened,
			forceClosed,
			errors,
			handleSubmit,
			register,
			router,
			roomID,
			playerID,
			error,
			refetch,
		]
	)

	return [render, () => setIsOpened(true)]
}
