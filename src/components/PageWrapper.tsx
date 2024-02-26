import { memo } from 'react'

export const PageWrapper = memo(function PageWrapper({
	children,
	style,
}: {
	children: React.ReactNode
	style?: React.CSSProperties
}) {
	return (
		<div className='flex justify-center w-full 100dvh' style={style}>
			<div className='max-w-[1200px] w-[90%] m-[5%]'>{children}</div>
		</div>
	)
})
