import { useMediaQuery } from 'react-responsive'

import { memo } from 'react'
import { breakpoints } from '../../../../tailwind.config'

type BreakpointKey = keyof typeof breakpoints

/** Only works in the client. Wrap with "Client" if you use this hook to check for hydration */
export function useBreakpoint(breakpointKey: BreakpointKey) {
	const breakpointValue = breakpoints?.[breakpointKey as BreakpointKey]
	const matches = useMediaQuery({
		// @ts-ignore
		...(breakpointValue?.max && {
			// @ts-ignore
			query: `(max-width: ${breakpointValue?.max})`,
		}),
		// @ts-ignore
		...(breakpointValue?.min && {
			// @ts-ignore
			query: `(min-width: ${breakpointValue?.min})`,
		}),
	})
	return matches
}

/** Works on the server and client. Only hides the children, should only be used in simple scenarios */
export const Desktop = memo(function Desktop({ children }: { children: React.ReactNode }) {
	return <div className='desktop:contents mobile:hidden'>{children}</div>
})

/** Works on the server and client. Only hides the children, should only be used in simple scenarios */
export const Mobile = memo(function Mobile({ children }: { children: React.ReactNode }) {
	return <div className='mobile:contents desktop:hidden'>{children}</div>
})
