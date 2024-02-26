import Head from 'next/head'

import clsx from 'clsx'
import { cardsList } from 'models/card'
import { memo } from 'react'
import styles from './PageWrapper.module.css'

export const PageWrapper = memo(function PageWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={clsx(
				styles.Background,
				'h-[100dvh] w-[100dvw] overflow-hidden flex justify-center'
			)}
		>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'
				/>

				{/* Preload all card images so they show up instantly during gameplay */}
				{cardsList.map((c) => (
					<link key={c} rel='preload' as='image' href={`/assets/cards/${c}.svg`} />
				))}
			</Head>

			<div className={clsx(styles.Container, 'flex justify-center items-center')}>
				{children}
			</div>
		</div>
	)
})
