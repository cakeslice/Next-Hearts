import { NextApiResponse } from 'next'
import { ZodTypeAny, z } from 'zod'

export function zodObjectKeys<T extends object>(object: T) {
	return Object.keys(object) as (keyof T)[]
}

export const arraySeparator = ','
export const zodQueryArray = <T extends ZodTypeAny>(schema: T) => {
	return z.preprocess((obj) => {
		if (Array.isArray(obj)) {
			return obj
		} else if (typeof obj === 'string' && obj.includes(arraySeparator)) {
			return obj.split(arraySeparator)
		} else {
			return [obj]
		}
	}, z.array(schema))
}

export function validate<T extends z.Schema>({
	schema,
	obj,
	res,
}: {
	schema: T
	obj: z.infer<typeof schema>
	res: NextApiResponse
}) {
	const parsedQuery = schema.safeParse(obj)
	if (!parsedQuery.success) {
		res.setHeader('message', parsedQuery.error.errors[0].message)
		res.status(400).send(undefined)
		return
	}

	return parsedQuery.data as z.infer<typeof schema>
}
