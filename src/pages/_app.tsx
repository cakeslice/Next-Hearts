import { I18nProvider } from '@lingui/react'
import { useLingui } from 'config'
import { AppCore } from 'core/_app'
import { AppProps } from 'next/app'
import { useLinguiInit } from 'translations/utils'
import '../fonts.css'
import '../globals.css'

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	const initializedI18n = useLinguiInit(pageProps.i18n)

	return (
		<AppCore>
			{useLingui ? (
				<I18nProvider i18n={initializedI18n}>
					<Component {...pageProps} />
				</I18nProvider>
			) : (
				<Component {...pageProps} />
			)}
		</AppCore>
	)
}
