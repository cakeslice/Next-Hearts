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
	mobile: { max: '800px' },
	desktop: { min: '800px' },
}

export const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			screens: breakpoints,
			colors: {
				subtle: {
					light: 'rgba(0, 50, 175, 0.05)',
					dark: 'rgba(255, 255, 255, 0.05)',
				},
			},
			animation: {
				fade: 'fade 1s ease-in-out',
				fadedelay: 'fadedelay 1s ease-in-out',
				up: 'up 0.5s ease-in-out',
				down: 'down 0.5s ease-in-out',
			},
			keyframes: {
				fade: {
					'0%': { opacity: '0%' },
					'100%': { opacity: '100%' },
				},
				fadedelay: {
					'0%': { opacity: '0%' },
					'50%': { opacity: '0%' },
					'100%': { opacity: '100%' },
				},
				down: {
					'0%': { opacity: '0%', transform: 'translatey(-20px)' },
					'100%': { opacity: '100%', transform: 'translatey(0px)' },
				},
				up: {
					'0%': { opacity: '0%', transform: 'translatey(20px)' },
					'100%': { opacity: '100%', transform: 'translatey(0px)' },
				},
			},
		},
	},
	safelist: [
		'bg-purple-300',
		'bg-yellow-300',
		'bg-green-300',
		'bg-blue-300',
		'bg-pink-300',
		'bg-red-300',

		'text-purple-400',
		'text-yellow-400',
		'text-green-400',
		'text-blue-400',
		'text-pink-400',
		'text-red-400',
	],
	plugins: [
		require('tailwindcss-animate'),
		nextui({
			addCommonColors: true,
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
