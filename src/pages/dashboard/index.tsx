import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { Button, Checkbox, Chip, Divider, Input, Spacer, Spinner } from '@nextui-org/react'
import { useDebounce } from '@uidotdev/usehooks'
import PageWrapper from 'components/PageWrapper'
import DashboardWrapper from 'components/dashboard/DashboardWrapper'
import { request, useApi, useQueryParams } from 'core/client/api'
import { Desktop, Mobile } from 'core/client/components/MediaQuery'
import { useDark } from 'core/client/hooks'
import { Company, allCategories, categoryStyle } from 'models/company'
import type { NextPage } from 'next'
import { useTheme } from 'next-themes'
import { Body as AddDataBody } from 'pages/api/add-data'
import { Query as CompanyQuery, Response } from 'pages/api/companies'
import { useEffect, useState } from 'react'
import { Client } from 'react-hydration-provider'

const Filters = () => {
	const { query, setQuery } = useQueryParams<CompanyQuery>()

	const [search, setSearch] = useState(query.search)
	const debouncedSearch = useDebounce(search, 200)

	useEffect(() => {
		setQuery({ search: debouncedSearch })
	}, [debouncedSearch])

	return (
		<>
			<Input
				className='w-auto'
				autoFocus
				variant='bordered'
				placeholder='Search by company name'
				defaultValue={query.search}
				style={{ flex: 'grow', minWidth: 250, maxWidth: 400 }}
				onChange={(e) => {
					setSearch(e.currentTarget.value)
				}}
			/>

			<div className='flex flex-wrap items-center' style={{ gap: 15 }}>
				{allCategories.map((s) => (
					<>
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
					</>
				))}
			</div>
		</>
	)
}

const ThemeToggle = () => {
	const { dark } = useDark()
	const { setTheme } = useTheme()

	return (
		<Client>
			<Button className='min-w-fit' onClick={() => setTheme(dark ? 'light' : 'dark')}>
				{dark ? (
					<SunIcon className='text-gray-300 w-6' />
				) : (
					<MoonIcon className='text-gray-500 w-5' />
				)}
			</Button>
		</Client>
	)
}

const Dashboard: NextPage = () => {
	const [filtersOpen, setFiltersOpen] = useState(false)

	const { query } = useQueryParams<CompanyQuery>()

	const { data, isLoading } = useApi<Response, CompanyQuery, {}>(['companies', query])

	const sendData = async () => {
		const [res, error] = await request<{ helloSuccess: string }, {}, AddDataBody>({
			path: 'add-data',
			body: {
				hello: true,
			},
		})
		if (error) alert(error.message)
	}

	return (
		<PageWrapper>
			<DashboardWrapper>
				<div
					className='flex flex-wrap justify-between items-center'
					style={{ gap: '15px 30px' }}
				>
					<Desktop>
						<Filters />
						<div className='flex gap-3'>
							<ThemeToggle />
							<Button
								color='primary'
								onClick={async () => {
									await sendData()
								}}
							>
								Save
							</Button>
						</div>
					</Desktop>
					<Mobile>
						<Button onClick={() => setFiltersOpen((o) => !o)}>Filters</Button>
						<ThemeToggle />
					</Mobile>

					{filtersOpen && (
						<div className='flex flex-col desktop:hidden' style={{ gap: 15 }}>
							<Filters />
						</div>
					)}
				</div>

				<Spacer y={5} />

				<div
					className='grid desktop:grid-cols-3 desktop:items-center desktop:gap-6 mobile:gap-x-1 mobile:gap-y-6'
					style={{
						padding: 24,
						border: '1px solid rgba(126,126,126,.3)',
						borderRadius: 10,
						minHeight: 500,
						alignContent: 'flex-start',
					}}
				>
					{['Company', 'Categories', 'City'].map((h) => (
						<div
							key={h}
							className='mobile:hidden'
							style={{
								fontWeight: 500,
							}}
						>
							{h}
						</div>
					))}
					<div
						className='desktop:hidden'
						style={{
							fontWeight: 500,
						}}
					>
						Companies
					</div>

					<div className='col-span-full'>
						<Divider />
					</div>

					<Client>
						{(isLoading || !data) && (
							<div
								style={{ minHeight: 100 }}
								className='col-span-full flex items-center justify-center'
							>
								{isLoading && <Spinner />}
							</div>
						)}

						{!isLoading &&
							data &&
							(data?.companies?.length > 0 ? (
								data?.companies?.map((c) => <Row key={c.name} company={c} />)
							) : (
								<div
									style={{ minHeight: 100 }}
									className='col-span-full flex items-center justify-center'
								>
									No results...
								</div>
							))}
					</Client>
				</div>
			</DashboardWrapper>
		</PageWrapper>
	)
}

const Row = (props: { company: Company }) => {
	const { dark } = useDark()

	const c = props.company

	return (
		<div className='desktop:contents mobile:border-1 mobile:border-primary mobile:p-4 rounded-lg'>
			<div style={{ fontWeight: 500, opacity: dark ? 1 : 0.75 }}>{c.name}</div>

			<Desktop>
				<div className='flex' style={{ gap: 10 }}>
					{c.categories.map((s) => (
						<Chip className={categoryStyle[s]} variant='bordered' key={s}>
							{s}
						</Chip>
					))}
				</div>
				<div>{c.city}</div>
			</Desktop>

			<div className='flex flex-col items-end desktop:hidden' style={{ gap: 10 }}>
				<div>{c.city}</div>
				<div className='flex justify-end' style={{ flexWrap: 'wrap', gap: 10 }}>
					{c.categories.map((s) => (
						<Chip className={categoryStyle[s]} key={s}>
							{s}
						</Chip>
					))}
				</div>
			</div>
		</div>
	)
}

export default Dashboard
