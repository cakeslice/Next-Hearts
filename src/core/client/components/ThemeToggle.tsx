import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { Switch } from '@nextui-org/react'
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
				onClick={() => setTheme(dark ? 'light' : 'dark')}
				size='lg'
				color='default'
				endContent={<SunIcon className='text-gray-500 w-6' />}
				startContent={<MoonIcon className='text-gray-300 w-5' />}
			/>
		</Client>
	)
}
