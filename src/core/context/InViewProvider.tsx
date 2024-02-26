import { createContext, memo, useContext, useState } from 'react'

/** This can be used with <Anchor/> to set the current component in view and highlight the link in a nav bar for example */
const inViewContext = // @ts-ignore
	createContext<[string | undefined, Dispatch<SetStateAction<string | undefined>>]>()

export const InViewProvider = memo(function InViewProvider(props: { children: React.ReactNode }) {
	const [inView, setInView] = useState<string>()

	return (
		<inViewContext.Provider value={[inView, setInView]}>
			{props.children}
		</inViewContext.Provider>
	)
})

export const useInViewContext = () => useContext(inViewContext)
