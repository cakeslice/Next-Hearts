import { useTheme } from 'next-themes'

export type Theme = 'system' | 'dark' | 'light'
/** Only works in the client. Wrap with "Client" if you use this hook to check for hydration */
export const useDark = () => {
	const { resolvedTheme } = useTheme()

	return { dark: resolvedTheme === 'dark' }
}
