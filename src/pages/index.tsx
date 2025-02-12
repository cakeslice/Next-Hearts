import { Button, Link, Spacer } from "@heroui/react"
import { PageWrapper } from 'components/PageWrapper'
import { useApi, useQueryParams } from 'core/client/api'
import type { NextPage } from 'next'
import { Query, QuerySchema, Response } from 'pages/api/hello'

const Home: NextPage = () => {
	const { query } = useQueryParams(QuerySchema)

	const { data } = useApi<Response, Query, {}>({ path: 'hello', query })

	return (
		<PageWrapper>
			<div>{data?.hello}</div>

			<Spacer y={5} />

			<Button as={Link} href='/dashboard'>
				Dashboard
			</Button>
		</PageWrapper>
	)
}

export default Home
