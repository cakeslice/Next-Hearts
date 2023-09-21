import { zodObjectKeys, zodQueryArray } from 'core/server/zod'
import { z } from 'zod'

export const categoryStyle = {
	Excavation: 'bg-orange-300 dark:bg-orange-700',
	Electrical: 'bg-pink-300 dark:bg-pink-700',
	Plumbing: 'bg-cyan-300 dark:bg-cyan-700',
}
export type Category = keyof typeof categoryStyle
export const allCategories = Object.keys(categoryStyle) as Category[]

export type Company = {
	name: string
	logo: string
	categories: Category[]
	city: string
}

const [firstCat, ...restCats] = zodObjectKeys(categoryStyle)
export const zodCategories = z.optional(zodQueryArray(z.enum([firstCat!, ...restCats])))

export const companiesData: Company[] = [
	{
		name: 'Construct-X',
		logo: '',
		categories: ['Excavation'],
		city: 'Lisbon',
	},
	{
		name: 'Buildify',
		logo: '',
		categories: ['Electrical', 'Plumbing'],
		city: 'Essen',
	},
	{
		name: 'Meta-Builders',
		logo: '',
		categories: ['Electrical', 'Excavation'],
		city: 'Munich',
	},
	{
		name: 'Brick-by-Brick',
		logo: '',
		categories: ['Plumbing'],
		city: 'Berlin',
	},
]
