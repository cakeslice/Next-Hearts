import { useInView } from 'framer-motion'
import { memo, useEffect, useRef, useState } from 'react'

export const ShowInView = memo(function ShowInView({
	persist,
	children,
}: {
	persist?: boolean
	children: React.ReactNode
}) {
	const [keepShowing, setKeepShowing] = useState(false)

	const ref = useRef(null)
	const isInView = useInView(ref)

	useEffect(() => {
		if (isInView && persist) setKeepShowing(true)
	}, [isInView, persist])

	return <div ref={ref}>{(isInView || keepShowing) && children}</div>
})
