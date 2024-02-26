import { Avatar, Chip } from '@nextui-org/react'
import { Company, categoryStyle } from 'models/company'

export const Cell = (company: Company, columnKey: string) => {
	switch (columnKey) {
		case 'name':
			return (
				<div className='flex gap-[10px]'>
					<div>
						<Avatar showFallback name={company.name} src={company.logo} />
					</div>
					<p className='text-bold'>{company.name}</p>
				</div>
			)
		case 'categories':
			return (
				<div className='flex gap-[10px]'>
					{company.categories.map((s) => (
						<Chip className={categoryStyle[s]} variant='bordered' key={s}>
							{s}
						</Chip>
					))}
				</div>
			)
		case 'city':
			return company.city
		case 'info':
			return (
				<div className='flex flex-col items-end desktop:hidden text-right gap-[10px]'>
					<div>{company.city}</div>
					<div className='flex justify-end flex-wrap gap-[10px]'>
						{company.categories.map((s) => (
							<div className={categoryStyle[s] + ' rounded w-2 h-2'} key={s} />
						))}
					</div>
				</div>
			)
		default:
			return undefined
	}
}
