import { nextui } from '@nextui-org/react'
import { Config } from 'tailwindcss'

export const breakpoints = {
	mobile: { max: '639px' },
	desktop: { min: '639px' },
}

export const config: Config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			screens: breakpoints,
		},
	},
	plugins: [
		nextui({
			themes: {
				dark: {
					colors: {
						primary: {
							DEFAULT: '#BEF264',
							foreground: '#000000',
						},
						focus: '#BEF264',
					},
				},
			},
		}),
	],
}

export default config
