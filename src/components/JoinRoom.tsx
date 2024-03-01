import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './JoinRoom.module.css'

import { Button, Input, Link, Modal, ModalContent, Spacer, Tooltip } from '@nextui-org/react'
import clsx from 'clsx'
import { title } from 'config'
import { request } from 'core/client/api'
import { Body, Response } from 'pages/api/join-game'
import { modalProps } from 'utils/consts'
import card2 from '../../public/assets/cards/ace_of_hearts.svg'
import card1 from '../../public/assets/cards/queen_of_spades.svg'
import githubIcon from '../../public/assets/github-mark.svg'
import { ModalWrapper } from './ModalContent'

const ForkMeButton = () => (
	<div className=' self-end max-h-0 relative'>
		<Tooltip
			placement='right'
			content='Fork me on GitHub'
			classNames={{
				content:
					'py-2 px-4 shadow-xl text-black bg-gradient-to-br from-white to-neutral-400',
			}}
		>
			<Link href='https://github.com/cakeslice/Next-Hearts' target='_blank'>
				<Image width={20} height={20} alt='GitHub' src={githubIcon} />
			</Link>
		</Tooltip>
	</div>
)

const Logo = () => (
	<div className='flex'>
		<div className='w-[20px]'>
			<Image
				priority
				className={clsx(styles.LogoShadow, styles.Card1, `min-w-[80px] w-[80px]`)}
				alt='Card'
				src={card1}
			/>
		</div>

		<Image
			priority
			className={clsx(styles.LogoShadow, styles.Card2, `w-[80px] left-[10px] relative`)}
			alt='Card'
			src={card2}
		/>
	</div>
)

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
							const { result } = await request<Response, undefined, Body>({
								path: 'join-game',
								body: {
									playerID,
									roomID,
									name: values.name,
								},
							})
							if (result?.roomID) {
								router.push('/?room=' + result.roomID)
								refetch()
								setIsOpened(false)
							} else {
								router.push('/')
								setError(result?.error || 'Something went wrong')
							}
						})}
					>
						<ModalWrapper>
							<ForkMeButton />

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
