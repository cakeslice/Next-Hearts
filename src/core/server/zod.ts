import { ZodTypeAny, z } from 'zod'

export function zodObjectKeys<T extends object>(object: T) {
	return Object.keys(object) as (keyof T)[]
}

export const arrayPrefix = '#arr_'
export const arraySeparator = ','
export const zodQueryStringArray = <T extends ZodTypeAny>(schema: T) => {
	return z.preprocess((obj) => {
		if (Array.isArray(obj)) {
			return obj
		} else if (typeof obj === 'string' && obj.includes(arrayPrefix)) {
			return obj.replace(arrayPrefix, '').split(arraySeparator)
		} else {
			return []
		}
	}, z.array(schema))
}
