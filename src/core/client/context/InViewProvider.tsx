import { Dispatch, SetStateAction, createContext, memo, useContext, useMemo, useState } from 'react'

type ContextValue = [string | undefined, Dispatch<SetStateAction<string | undefined>>]

/** This can be used with <Anchor/> to set the current component in view and highlight the link in a nav bar for example */
const context = createContext<ContextValue>([undefined, () => {}])

export const InViewProvider = memo(function InViewProvider(props: { children: React.ReactNode }) {
	const [inView, setInView] = useState<string>()

	const value: ContextValue = useMemo(() => [inView, setInView], [inView, setInView])

	return <context.Provider value={value}>{props.children}</context.Provider>
})

export const useInView = () => useContext(context)
