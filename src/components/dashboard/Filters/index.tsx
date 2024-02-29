import { Checkbox, Chip } from '@nextui-org/react'
import { useQueryParams } from 'core/client/api'
import { Input } from 'core/client/components/Input'
import { allCategories, categoryStyle } from 'models/company'
import { Query as CompanyQuery } from 'pages/api/companies'

export const Filters = () => {
	const { query, setQuery, queryReady } = useQueryParams<CompanyQuery>()

	return (
		<>
			{queryReady && (
				<Input
					debounced
					data-testid='dashboard.Filters.Input-search'
					className='w-auto grow min-w-[250px] max-w-[400px]'
					variant='bordered'
					placeholder='Search by company name'
					defaultValue={query.search}
					classNames={{
						inputWrapper: 'd-input-primary',
					}}
					onChange={(e) => {
						setQuery({ search: e })
					}}
				/>
			)}

			<div className='flex flex-wrap items-center gap-[15px]'>
				{queryReady &&
					allCategories.map((s) => (
						<Checkbox
							key={s}
							defaultSelected={query.categories?.includes(s) || false}
							onChange={(e) => {
								// TODO: Maybe with zod?
								// Otherwise we need to do Array.isArray everytime...
								let array = Array.isArray(query.categories)
									? query.categories
									: query.categories
										? [query.categories]
										: []

								if (e.currentTarget.checked) {
									if (array.indexOf(s) === -1) array.push(s)
								} else array = array.filter((e) => e !== s)

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
