import { Checkbox, Chip, Input } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'
import { useQueryParams } from 'core/client/api'
import { allCategories, categoryStyle } from 'models/company'
import { Query as CompanyQuery } from 'pages/api/companies'
import { useEffect, useState } from 'react'

export const Filters = () => {
	const { query, setQuery } = useQueryParams<CompanyQuery>()

	const [search, setSearch] = useState(query.search)
	const debouncedSearch = useDebounce(search, 200)

	useEffect(() => {
		setQuery({ search: debouncedSearch })
	}, [debouncedSearch])

	return (
		<>
			<Input
				data-testid='dashboard.Filters.Input-search'
				className='w-auto grow min-w-[250px] max-w-[400px]'
				autoFocus
				variant='bordered'
				placeholder='Search by company name'
				defaultValue={query.search}
				onChange={(e) => {
					setSearch(e.currentTarget.value)
				}}
			/>

			<div className='flex flex-wrap items-center gap-[15px]'>
				{allCategories.map((s) => (
					<Checkbox
						key={s}
						checked={query.categories?.includes(s) || false}
						onChange={(e) => {
							// TODO: Maybe with zod?
							// Otherwise we need to do Array.isArray everytime...
							let array = Array.isArray(query.categories)
								? query.categories
								: query.categories
									? [query.categories]
									: []

							if (e.currentTarget.checked) array.push(s)
							else array = array.filter((e) => e !== s)

							setQuery({ categories: array })
						}}
					>
						<Chip variant='bordered' className={categoryStyle[s]}>
							{s}
						</Chip>
					</Checkbox>
				))}
			</div>
		</>
	)
}
