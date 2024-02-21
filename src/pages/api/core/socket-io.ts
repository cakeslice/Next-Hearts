import { websocketsEnabled } from 'config'
import { backendURL } from 'core/env'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer } from 'socket.io'

declare global {
	var io: IOServer | undefined
}

interface SocketServer extends HTTPServer {
	io?: IOServer | undefined
}
interface SocketWithIO extends NetSocket {
	server: SocketServer
}
interface NextApiResponseWithSocket<T> extends NextApiResponse<T> {
	socket: SocketWithIO
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket<void>) {
	if (!websocketsEnabled) return res.status(400).send()

	if (!res.socket.server.io) {
		console.log('[Socket.IO] Starting server...')

		const io = new IOServer(res.socket.server, {
			path: backendURL + '/core/ws',
			addTrailingSlash: false,
			transports: ['websocket'],
		})
		global.io = io

		io.on('connection', (socket) => {
			console.log('[Socket.IO] Connected: ' + socket.id)
			socket.on('disconnect', () => {
				console.log('[Socket.IO] Disconnected: ' + socket.id)
			})
		})

		res.socket.server.io = io
	} else {
	}
	res.end()
}
