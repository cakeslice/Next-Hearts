import { nextui } from '@nextui-org/react'
import { Config } from 'tailwindcss'

const colors = {
	primary: {
		100: 'rgba(130, 201, 30,.5)',
		DEFAULT: 'rgba(130, 201, 30)',
		foreground: 'white',
	},
	focus: 'rgba(130, 201, 30)',
}

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
				light: {
					colors: colors,
				},
				dark: {
					colors: colors,
				},
			},
		}),
	],
}

export default config
