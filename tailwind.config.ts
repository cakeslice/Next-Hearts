import { ConfigTheme, LayoutTheme, nextui } from '@nextui-org/react'
import { Config } from 'tailwindcss'
const { createThemes } = require('tw-colors')

type CustomTheme = {
	light: ConfigTheme['colors']
	dark: ConfigTheme['colors']
}

// -----------

const brandColor = {
	light: 'rgba(0,117,255, 1)',
	dark: '#BEF264',
}

const theme: CustomTheme = {
	light: {
		// className: 'text-primary-500', CSS: hsl(var(--theme-primary-500) / 0.5)
		primary: {
			DEFAULT: brandColor.light,
			foreground: 'rgba(255,255,255,1)',
		},
		focus: brandColor.light,
		background: 'rgba(245,245,245,1)',
	},
	dark: {
		primary: {
			DEFAULT: brandColor.dark,
			foreground: '#000000',
		},
		focus: brandColor.dark,
	},
}

const colors = {
	// className: 'text-brand/50', CSS: hsl(var(--color-brand) / 0.5)
	brand: brandColor.light,
	subtle: 'rgba(0, 50, 175, 0.05)',
	test: 'rgb(255,0,0)',
}
let darkColors: Partial<typeof colors> = {
	brand: brandColor.dark,
	subtle: 'rgba(255, 255, 255, 0.05)',
	test: 'rgb(0,255,255)',
}

export const breakpoints = {
	mini: { max: '465px' },
	biggermini: { min: '465px' },
	mobile: { max: '800px' },
	desktop: { min: '800px' },
	bigger: { min: '1070px' },
	evenbigger: { min: '1460px' },
}

const layout: LayoutTheme = {
	spacingUnit: 4, // in px
	fontSize: {
		tiny: '0.75rem', // text-tiny
		small: '0.875rem', // text-small
		medium: '1rem', // text-medium
		large: '1.125rem', // text-large
	},
	lineHeight: {
		tiny: '1rem', // text-tiny
		small: '1.25rem', // text-small
		medium: '1.5rem', // text-medium
		large: '1.75rem', // text-large
	},
	radius: {
		small: '8px', // rounded-small
		medium: '12px', // rounded-medium
		large: '14px', // rounded-large
	},
}

const spacings = {
	sm: '8px',
	md: '12px',
	lg: '16px',
	xl: '24px',
}

const animations = {
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
}

const safelist = [
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
]

// -----------

darkColors = {
	...colors,
	...darkColors,
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
			spacing: spacings,
			...animations,
		},
	},
	safelist: safelist,
	plugins: [
		createThemes(
			{
				light: colors,
				dark: darkColors,
			},
			{
				produceCssVariable: (colorName: string) => `--color-${colorName}`,
			}
		),
		require('tailwindcss-animate'),
		nextui({
			prefix: 'theme',
			addCommonColors: true,
			layout,
			themes: {
				light: {
					colors: theme.light,
				},
				dark: {
					colors: theme.dark,
				},
			},
		}),
	],
}

export default config
