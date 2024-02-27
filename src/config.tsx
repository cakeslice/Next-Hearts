import { Theme } from 'core/client/hooks'

export const enableRenderPerformanceDebugging = false

export const websocketsEnabled = false

export const defaultTheme: Theme = 'system'
export const forceTheme: Theme | undefined = undefined

export const title = 'Next.js boilerplate'
export const description = 'Next.js + Tailwind + Next-UI + React Hook Form'

// Preconnect to load assets like fonts faster
export const preconnectURLs: { link: string; crossOrigin?: boolean }[] = [
	{ link: 'https://fonts.gstatic.com', crossOrigin: true },
	{ link: 'https://fonts.googleapis.com' },
]
