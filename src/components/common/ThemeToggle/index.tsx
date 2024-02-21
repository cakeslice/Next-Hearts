import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { Button } from '@nextui-org/react'
import { useDark } from 'core/client/hooks'
import { useTheme } from 'next-themes'
import { Client } from 'react-hydration-provider'

export const ThemeToggle = () => {
	const { dark } = useDark()
	const { setTheme } = useTheme()

	return (
		<Client>
			<Button className='min-w-fit' onClick={() => setTheme(dark ? 'light' : 'dark')}>
				{dark ? (
					<SunIcon className='text-gray-300 w-6' />
				) : (
					<MoonIcon className='text-gray-500 w-5' />
				)}
			</Button>
		</Client>
	)
}
