import { NextUIProvider } from '@nextui-org/react'
import { defaultTheme, description, forceTheme, preconnectURLs, title } from 'config'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { HydrationProvider } from 'react-hydration-provider'
import { SocketContext, socket } from './client/socket-io'

export const AppCore = ({ children }: { children: React.ReactNode }) => {
	return (
		<NextUIProvider>
			<HydrationProvider>
				<ThemeProvider
					attribute='class'
					forcedTheme={forceTheme}
					defaultTheme={defaultTheme}
				>
					<SocketContext.Provider value={socket}>
						<Head>
							<title>{title}</title>
							<meta name='description' content={description} />
							<link rel='icon' href='/favicon.ico' />

							{preconnectURLs.map((url) => (
								<link
									key={url.link}
									rel='preconnect'
									href={url.link}
									crossOrigin={url.crossOrigin ? 'anonymous' : undefined}
								/>
							))}

							<meta
								name='viewport'
								content='minimum-scale=1, initial-scale=1, width=device-width'
							/>

							<meta name='darkreader-lock' />
						</Head>

						{children}
					</SocketContext.Provider>
				</ThemeProvider>
			</HydrationProvider>
		</NextUIProvider>
	)
}
