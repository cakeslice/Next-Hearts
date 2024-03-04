import { isbot } from 'isbot'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

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

export const usePagination = (totalItems?: number, rowsPerPage = 10) => {
	const pages = useMemo(() => {
		return totalItems ? Math.ceil(totalItems / rowsPerPage) : 0
	}, [totalItems, rowsPerPage])

	return { pages }
}
