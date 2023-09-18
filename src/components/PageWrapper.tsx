export default function PageWrapper({
	children,
	style,
}: {
	children: React.ReactNode
	style?: React.CSSProperties
}) {
	return (
		<div style={{ ...style, minHeight: '100dvh' }} className='flex justify-center w-full'>
			<div style={{ maxWidth: 1200, width: '90%', margin: '5%' }}>{children}</div>
		</div>
	)
}
