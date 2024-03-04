import { websocketsEnabled } from 'config'
import { request } from 'core/client/api'
import { backendURL } from 'core/env'
import React, { useEffect } from 'react'
import { Socket, io } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export const socket = websocketsEnabled
	? io({ path: backendURL + '/core/ws', autoConnect: false, transports: ['websocket'] })
	: undefined
export const SocketContext = React.createContext(socket)

const startConnection = async () => {
	await request({ path: 'core/socket-io' })

	socket?.connect()

	socket?.on('connect', () => {
		console.log('[Socket.IO] Connected')
	})
	socket?.on('disconnect', () => {
		console.log('[Socket.IO] Disconnected')
	})
	socket?.on('reconnect_attempt', async (attempt) => {
		await request({ path: 'socket-io' })
		console.log('[Socket.IO] Reconnect attempt #' + attempt)
	})
}

if (websocketsEnabled) {
	startConnection()
}

export function useSocketChannel<
	ServerEvents extends DefaultEventsMap,
	ClientEvents extends DefaultEventsMap,
>(events: Partial<ClientEvents>) {
	useEffect(() => {
		Object.keys(events).forEach((channel) => {
			socket?.on(channel as string, events[channel] as () => void)
		})

		return () => {
			Object.keys(events).forEach((channel) => {
				socket?.off(channel as string, events[channel])
			})
		}
	}, [events])

	return [socket as Socket<ClientEvents, ServerEvents>]
}
