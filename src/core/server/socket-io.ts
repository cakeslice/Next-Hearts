import { NextApiRequestTyped } from 'core/server/types.js'
import { NextApiRequest } from 'next'
import { Server, Socket } from 'socket.io'
import {
	DefaultEventsMap,
	EventNames,
	RemoveAcknowledgements,
} from 'socket.io/dist/typed-events.js'

export function socketMessage<ClientEvents extends DefaultEventsMap>(
	req: NextApiRequest | NextApiRequestTyped<any, any>,
	channel: EventNames<ClientEvents>,
	message: Parameters<ClientEvents[typeof channel]>[0]
) {
	const id = req.headers['x-socket-id'] as string | undefined
	if (!id) return

	const socket = global.io?.sockets.sockets.get(id) as
		| Socket<DefaultEventsMap, ClientEvents>
		| undefined

	// @ts-ignore
	socket?.emit(channel, message)
}

export function socketBroadcast<ClientEvents extends DefaultEventsMap>(
	channel: EventNames<ClientEvents>,
	message: Parameters<ClientEvents[typeof channel]>[0],
	roomId: string
): void
export function socketBroadcast<ClientEvents extends DefaultEventsMap>(
	channel: EventNames<RemoveAcknowledgements<ClientEvents>>,
	message: Parameters<ClientEvents[typeof channel]>[0],
	roomId: undefined
): void
export function socketBroadcast<ClientEvents extends DefaultEventsMap>(
	channel: EventNames<ClientEvents> | EventNames<RemoveAcknowledgements<ClientEvents>>,
	message: Parameters<ClientEvents[typeof channel]>[0],
	roomId: string | undefined
) {
	const io = global.io as Server<DefaultEventsMap, ClientEvents> | undefined

	roomId
		? // @ts-ignore
			io?.to(roomId)?.emit(channel, message)
		: // @ts-ignore
			io?.emit(channel as EventNames<RemoveAcknowledgements<ClientEvents>>, message)
}

/** If already joined, doesn't do anything */
export function joinSocketRoom(
	req: NextApiRequest | NextApiRequestTyped<any, any>,
	roomId: string
) {
	const id = req.headers['x-socket-id'] as string | undefined

	if (!global.io || !id) return

	const socket = global.io?.sockets.sockets.get(id) as Socket | undefined
	if (socket && !socket.rooms.has(roomId)) {
		console.log('Socket ' + id + ' joined room ' + roomId)
		socket.join(roomId)
	}
}

/** If already setup, doesn't do anything */
export function setupSocketEvents<ServerEvents extends DefaultEventsMap>(
	req: NextApiRequest | NextApiRequestTyped<any, any>,
	events?: (socket: Socket<ServerEvents, DefaultEventsMap>) => void
) {
	const id = req.headers['x-socket-id'] as string | undefined

	if (!global.io || !id) return

	const socket = global.io?.sockets.sockets.get(id) as
		| Socket<ServerEvents, DefaultEventsMap>
		| undefined
	if (socket && !socket.data.eventsInitialized) {
		events?.(socket)
		socket.data = { eventsInitialized: true }
	}
	return
}
