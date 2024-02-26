import { isbot } from 'isbot'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export type Theme = 'system' | 'dark' | 'light'
/** Only works in the client. Wrap with "Client" if you use this hook to check for hydration */
export const useDark = () => {
	const { resolvedTheme } = useTheme()

	return resolvedTheme === 'dark'
}

export const useIsBot = () => {
	const [isBot, setIsBot] = useState(true)

	useEffect(() => {
		setIsBot(navigator ? isbot(navigator?.userAgent) : false)
	}, [setIsBot])

	return isBot
}
