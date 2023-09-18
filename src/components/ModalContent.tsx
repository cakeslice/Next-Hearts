import { Card } from '@nextui-org/react'
import { highlightColor } from 'utils/consts'

export const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
	<Card
		className='min-h-96 w-full gap-5 px-8 py-6 flex flex-col justify-between items-center'
		style={{
			border: `4px solid rgba(${highlightColor}, 1)`,
		}}
		shadow='lg'
	>
		{children}
	</Card>
)
