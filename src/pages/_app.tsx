import { AppCore } from 'core/_app'
import { AppProps } from 'next/app'
import { useLinguiInit } from 'translations/utils'
import '../fonts.css'
import '../globals.css'

import { I18nProvider } from '@lingui/react'

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	const initializedI18n = useLinguiInit(pageProps.i18n)

	return (
		<AppCore>
			<I18nProvider i18n={initializedI18n}>
				<Component {...pageProps} />
			</I18nProvider>
		</AppCore>
	)
}
