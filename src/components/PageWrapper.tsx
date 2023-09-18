import { description, title } from 'config'
import Head from 'next/head'
import { backgroundColor, backgroundImage } from 'utils/consts'

export default function PageWrapper({
	children,
	style,
}: {
	children: React.ReactNode
	style?: React.CSSProperties
}) {
	return (
		<div
			style={{
				width: '100dvw',
				height: '100dvh',
				overflow: 'hidden',
				backgroundColor: backgroundColor,
				backgroundSize: '5rem',
				backgroundImage: backgroundImage,
			}}
			className='flex justify-center w-full'
		>
			<Head>
				<title>{title}</title>
				<meta name='description' content={description} />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'
				/>
			</Head>

			<div
				className='flex justify-center items-center'
				style={{ maxWidth: 1200, width: '90%', margin: '5%' }}
			>
				{children}
			</div>
		</div>
	)
}
