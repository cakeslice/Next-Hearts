import { NextUIProvider } from '@nextui-org/react'
import { defaultTheme, description, title } from 'config'
import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { HydrationProvider } from 'react-hydration-provider'
import { SocketContext, socket } from './client/socket-io'

export default function App(props: AppProps) {
	const { Component, pageProps } = props

	return (
		<NextUIProvider>
			<HydrationProvider>
				<ThemeProvider attribute='class' defaultTheme={defaultTheme}>
					<SocketContext.Provider value={socket}>
						<Head>
							<title>{title}</title>
							<meta name='description' content={description} />
							<link rel='icon' href='/favicon.ico' />

							<meta
								name='viewport'
								content='minimum-scale=1, initial-scale=1, width=device-width'
							/>

							<meta name='darkreader-lock' />
						</Head>

						<Component {...pageProps} />
					</SocketContext.Provider>
				</ThemeProvider>
			</HydrationProvider>
		</NextUIProvider>
	)
}
