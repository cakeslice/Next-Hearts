import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { Switch } from '@heroui/react'
import { useDark } from 'core/client/hooks'
import { useTheme } from 'next-themes'
import { Client } from 'react-hydration-provider'

export const ThemeToggle = () => {
	const dark = useDark()
	const { setTheme } = useTheme()

	return (
		<Client>
			<Switch
				defaultSelected={dark}
				onValueChange={(enabled) => {
					setTheme(!enabled ? 'light' : 'dark')
				}}
				size='lg'
				color='default'
				classNames={{
					startContent: 'w-5 text-default-700',
					endContent: 'w-6 text-default-700',
				}}
				startContent={<MoonIcon className='w-5' />}
				endContent={<SunIcon className='w-6' />}
			/>
		</Client>
	)
}
