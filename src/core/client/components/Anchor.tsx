import { useInViewContext } from 'core/client/context/InViewProvider'
import React, { Component, memo, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

type AnchorElementProps = {
	id: string
	anchorOffset?: number
}
type AnchorElementState = {
	anchorOffset: number
}
class AnchorElementComponent extends Component<AnchorElementProps, AnchorElementState> {
	state = {
		anchorOffset: this.props.anchorOffset || 160,
	}

	componentDidMount() {
		// Set the opposite anchorOffset after loading since for some reason scrolling to hash behaviour is different on page load vs click
		setTimeout(
			() =>
				this.setState((prev) => ({
					anchorOffset: -1 * ((this.props.anchorOffset || 160) - 30),
				})),
			100
		)
	}

	render() {
		return (
			<div
				id={this.props.id}
				className={'relative'}
				style={{
					top: this.state.anchorOffset,
				}}
			/>
		)
	}
}
const AnchorElement = memo(AnchorElementComponent)

const AnchorContent = memo(function AnchorContent({ children }: { children: React.ReactNode }) {
	return <>{children}</>
})

type Props = {
	id: string
	anchorOffset?: number
	triggerOffset?: number
	updateHash?: boolean
	children?: React.ReactNode
	triggerSetInView?: boolean
	onTrigger?: (id?: string) => void
	style?: React.CSSProperties
	className?: string
}
const AnchorComponent = ({
	triggerOffset,
	id,
	className,
	style,
	onTrigger,
	triggerSetInView = true,
	updateHash,
	anchorOffset,
	children,
}: Props) => {
	let triggered = false

	const margin = useMemo(() => (-70 + (triggerOffset || 0)).toString(), [triggerOffset])
	const rootMargin = `0px 0px ${margin}% 0px`

	const { ref, inView, entry } = useInView({
		rootMargin,
		onChange: (inView) => {
			if (inView) {
				if (!triggered) {
					triggered = true

					if (updateHash) {
						if (window.location.hash !== '#' + id) {
							window.history.replaceState({}, '', '#' + id)
						}
					}
					if (triggerSetInView) setInView('#' + id)
					if (onTrigger) onTrigger('#' + id)
				}
			} else triggered = false
		},
	})

	const [, setInView] = useInViewContext()

	return (
		<div className={className} style={style} ref={ref}>
			<AnchorElement id={id} anchorOffset={anchorOffset} />
			<AnchorContent>{children}</AnchorContent>
		</div>
	)
}

export const Anchor = memo(AnchorComponent)
