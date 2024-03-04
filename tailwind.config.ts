import { ColorScale, ConfigTheme, LayoutTheme, nextui } from '@nextui-org/react'
import { Config } from 'tailwindcss'

// With @apply: text-pink-500
// To get the color: theme(colors.pink.500)

const primitives: Record<string, Exclude<ColorScale, string>> = {
	pink: {
		100: '#FFF2F8FF',
		200: '#FDCAE4FF',
		300: '#FCA4D0FF',
		400: '#F55DAFFF',
		500: '#EB279DFF',
		600: '#DB049AFF',
		700: '#C400A2FF',
		800: '#A700A3FF',
		900: '#770087FF',
	},
	neutral: {
		100: '#FFFFFFFF',
		200: '#F9FAFCFF',
		300: '#F4F4F8FF',
		400: '#E3E4EBFF',
		500: '#CACBD4FF',
		600: '#A8A9B2FF',
		700: '#717188FF',
		800: '#323241FF',
		900: '#000000FF',
	},
	subtle: { DEFAULT: 'rgba(0, 50, 175, 0.05)' },
}

const theme: {
	light: ConfigTheme['colors']
	dark: ConfigTheme['colors']
} = {
	light: {
		//background: primitives.neutral[100],
		focus: 'rgba(130, 201, 30)', //primitives.pink[500],
		//content1: primitives.neutral[400],

		primary: {
			100: 'rgba(130, 201, 30,.5)',
			DEFAULT: 'rgba(130, 201, 30)',
			foreground: 'white',
			/* DEFAULT: primitives.pink[500],
			...primitives.pink,
			foreground: primitives.neutral[100], */
		},

		//default
		//secondary
		//success
		//warning
		//danger
	},
	dark: {
		background: primitives.neutral[800],
		focus: primitives.pink[500],

		primary: {
			foreground: primitives.neutral[900],
			DEFAULT: primitives.pink[500],
			...primitives.pink,
		},
	},
}

export const breakpoints = {
	mobile: { max: '800px' },
	desktop: { min: '800px' },
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
	{
		pattern: /bg-(red|green|blue|orange|pink|cyan)-(300|700)/,
		variants: ['dark'],
	},
]

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
			colors: primitives,
		},
	},
	safelist: safelist,
	plugins: [
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
