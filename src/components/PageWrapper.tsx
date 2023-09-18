import { description, title } from 'config'
import Head from 'next/head'

import clsx from 'clsx'
import styles from './PageWrapper.module.scss'

export default function PageWrapper({
	children,
	style,
}: {
	children: React.ReactNode
	style?: React.CSSProperties
}) {
	return (
		<div
			className={clsx(
				styles.Background,
				'h-[100dvh] w-[100dvw] overflow-hidden flex justify-center'
			)}
		>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'
				/>
			</Head>

			<div className={clsx(styles.Container, 'flex justify-center items-center')}>
				{children}
			</div>
		</div>
	)
}
