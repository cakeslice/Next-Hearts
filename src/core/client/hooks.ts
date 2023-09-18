import { useTheme } from 'next-themes'

export type Theme = 'system' | 'dark' | 'light'
/** Use <Client/> on components that use this */
export const useDark = () => {
	const { resolvedTheme } = useTheme()

	return { dark: resolvedTheme === 'dark' }
}
