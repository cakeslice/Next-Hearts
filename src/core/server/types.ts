import type { NextApiRequest } from 'next'

// @ts-ignore
export interface NextApiRequestTyped<QueryParams, Body = undefined> extends NextApiRequest {
	query: QueryParams
	body: Body
}
