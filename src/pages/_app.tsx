import { AppCore } from 'core/_app'
import { AppProps } from 'next/app'

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	return (
		<AppCore>
			<Component {...pageProps} />
		</AppCore>
	)
}
