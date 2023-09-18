import type { NextApiRequest } from 'next'

// @ts-ignore
export interface NextApiRequestTyped<QueryParams, Body> extends NextApiRequest {
	query: QueryParams
	body: Body
}
