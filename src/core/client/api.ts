import { useDebounce } from '@uidotdev/usehooks'
import { socket } from 'core/client/socket-io'
import { backendURL } from 'core/env'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import useSWR from 'swr'

class RequestError extends Error {
	status = 0
	constructor(message: string, status: number) {
		super(message)
		this.status = status
	}
}

type FetcherArgs = [string, string?, object?, RequestInit?]

async function fetcher<T>(args: FetcherArgs): Promise<T> {
	const url = args[0]
	const query = args[1]
	const body = args[2]
	const options = args[3]

	const response = await fetch(url + (query || ''), {
		method: body ? 'POST' : 'GET',
		headers: body
			? {
					'Content-Type': 'application/json',
			  }
			: undefined,
		body: body ? JSON.stringify(body) : undefined,
		...options,
	})
	if (!response.ok) {
		const message = response.headers && response.headers.get('message')
		throw new RequestError(message || 'Request error', response.status)
	}
	return response.json()
}
async function backendFetcher<T>(args: FetcherArgs): Promise<T> {
	const url = args[0]
	const query = args[1]
	const body = args[2]
	const options = args[3]

	return await fetcher([
		backendURL + url,
		query || '',
		body,
		{
			...options,
			headers: {
				'x-socket-id': socket?.id,
				...(body && {
					'Content-Type': 'application/json',
				}),
				...options?.headers,
			},
		},
	])
}

export async function request<Response, QueryParams, Body extends object | undefined>(args: {
	path: string
	query?: QueryParams
	body?: Body
	external?: boolean
	options?: RequestInit
}): Promise<[Response | undefined, RequestError | undefined]> {
	const path = '/' + args.path
	const query = args.query ? '?' + new URLSearchParams(args.query as any).toString() : undefined
	const body = args.body
	const external = args.external
	const options = args.options

	let result: Response | undefined = undefined
	let error: RequestError | undefined = undefined
	try {
		result = await (external
			? fetcher([path, query, body, options])
			: backendFetcher([path, query, body, options]))
	} catch (e) {
		error = e as RequestError
	}

	return [result, error]
}

export function useApi<Response, QueryParams, Body extends object | undefined>(
	args: [
		path: string,
		query?: QueryParams,
		body?: Body,
		external?: boolean,
		options?: RequestInit,
	]
) {
	const router = useRouter()

	const path = '/' + args[0]
	const query = args[1] ? '?' + new URLSearchParams(args[1] as any).toString() : undefined
	const body = args[2]
	const external = args[3]
	const options = args[4]

	const { data, mutate, isLoading, error } = useSWR<Response, RequestError>(
		router.isReady ? [path, query, body, options] : undefined,
		external ? fetcher : backendFetcher
	)

	const debouncedIsLoading = useDebounce(isLoading, 200)

	return { data, refetch: mutate, isLoading: debouncedIsLoading, error }
}

export function useQueryParams<T>() {
	const router = useRouter()
	const query = router.query as T

	const setQuery = useCallback(
		(newQueryParams: T) => {
			const params = {
				...router.query,
				...newQueryParams,
			}

			const queryParams: any = {}
			Object.keys(params).forEach((p) => {
				const value = params[p]
				if (value === undefined || value === '') return
				queryParams[p] = value
			})

			if (router.isReady) {
				router.replace(
					{
						pathname: window.location.pathname,
						query: queryParams,
					},
					undefined,
					{
						shallow: true,
					}
				)
			}
		},
		[router]
	)

	return { queryReady: router.isReady, query, setQuery }
}

export const getQueryString = (query: any) => new URLSearchParams(query).toString()
