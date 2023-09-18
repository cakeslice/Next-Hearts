import PageWrapper from 'components/PageWrapper'
import { useApi, useQueryParams } from 'core/client/api'
import type { NextPage } from 'next'
import { QueryParams, Response } from 'pages/api/hello'

const Home: NextPage = () => {
	const { query } = useQueryParams<QueryParams>()

	const { data } = useApi<Response, QueryParams, {}>(['hello', query])

	return (
		<PageWrapper>
			<div>{data?.hello}</div>
		</PageWrapper>
	)
}

export default Home
