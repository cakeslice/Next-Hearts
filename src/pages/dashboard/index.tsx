import {
	Button,
	Pagination,
	Spacer,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/react'
import { PageWrapper } from 'components/PageWrapper'
import { Cell } from 'components/dashboard/Cell'
import DashboardWrapper from 'components/dashboard/DashboardWrapper'
import { Filters } from 'components/dashboard/Filters'
import { request, useApi, useQueryParams } from 'core/client/api'
import { Desktop, Mobile, useBreakpoint } from 'core/client/components/MediaQuery'
import { ThemeToggle } from 'core/client/components/ThemeToggle'
import { usePagination } from 'core/client/hooks'
import type { NextPage } from 'next'
import { Body as AddDataBody, Response as AddDataResponse } from 'pages/api/add-data'
import { Query as CompanyQuery, QuerySchema as CompanySchema, Response } from 'pages/api/companies'
import { useMemo, useState } from 'react'
import { Client } from 'react-hydration-provider'

const columns = [
	{ name: 'COMPANY', uid: 'name' },
	{ name: 'CATEGORIES', uid: 'categories', desktop: true },
	{ name: 'CITY', uid: 'city', desktop: true },
	{ name: 'INFO', uid: 'info', mobile: true },
]

const Dashboard: NextPage = () => {
	const [filtersOpen, setFiltersOpen] = useState(false)

	const { query, setQuery } = useQueryParams(CompanySchema)

	const { data, isLoading } = useApi<Response, CompanyQuery, {}>({ path: 'companies', query })

	const sendData = async () => {
		const { result, error } = await request<AddDataResponse, {}, AddDataBody>({
			path: 'add-data',
			method: 'POST',
			body: {
				hello: true,
			},
		})
		if (error) alert(error.message)
		else console.log('Message from server: ' + result?.message)
	}

	const mobile = useBreakpoint('mobile')

	const responsiveColumns = useMemo(
		() => columns.filter((c) => (mobile ? !c.desktop : !c.mobile)),
		[mobile]
	)

	const { pages } = usePagination(data?.totalItems, 10)

	return (
		<PageWrapper>
			<DashboardWrapper>
				<div className='flex flex-wrap justify-between items-center gap-y-[15px] gap-x-[30px]'>
					<Desktop>
						<Filters />
						<div className='flex gap-3'>
							<ThemeToggle />
							<Button
								className='d-button-primary'
								onClick={async () => {
									await sendData()
								}}
							>
								Save
							</Button>
						</div>
					</Desktop>
					<Mobile>
						<Button
							className='d-button-secondary'
							onClick={() => setFiltersOpen((o) => !o)}
						>
							Filters
						</Button>
						<ThemeToggle />
					</Mobile>

					{filtersOpen && (
						<div className='flex flex-col desktop:hidden gap-[15px]'>
							<Filters />
						</div>
					)}
				</div>

				<Spacer y={5} />

				<Client>
					<Table
						bottomContent={
							pages > 0 ? (
								<div className='flex w-full justify-center'>
									<Pagination
										isCompact
										showControls
										showShadow
										color='primary'
										page={query.page || 1}
										total={pages}
										onChange={(page) => {
											setQuery({ page }), window.scrollTo(0, 0)
										}}
									/>
								</div>
							) : null
						}
						hideHeader={mobile}
						aria-label='Companies table'
					>
						<TableHeader columns={responsiveColumns}>
							{(column) => (
								<TableColumn
									width={
										column.uid === 'city'
											? '25%'
											: column.uid === 'categories'
												? 310
												: undefined
									}
									key={column.uid}
								>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>

						<TableBody
							isLoading={isLoading}
							emptyContent='No results...'
							loadingContent={<Spinner />}
							items={data?.companies || []}
						>
							{(item) => (
								<TableRow key={item.name}>
									{(columnKey) => (
										<TableCell>{Cell(item, `${columnKey}`)}</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Client>
			</DashboardWrapper>
		</PageWrapper>
	)
}

export default Dashboard
