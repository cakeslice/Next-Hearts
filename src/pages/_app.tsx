import { AppCore } from 'core/_app'
import { AppProps } from 'next/app'
import '../fonts.css'
import '../globals.css'

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	return (
		<AppCore>
			<Component {...pageProps} />
		</AppCore>
	)
}
