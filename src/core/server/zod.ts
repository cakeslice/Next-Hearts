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
