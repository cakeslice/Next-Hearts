import { PageWrapper } from 'components/PageWrapper'
import { useApi, useQueryParams } from 'core/client/api'
import type { NextPage } from 'next'
import { Query, Response } from 'pages/api/hello'

const Home: NextPage = () => {
	const { query } = useQueryParams<Query>()

	const { data } = useApi<Response, Query, {}>({ path: 'hello', query })

	return (
		<PageWrapper>
			<div>{data?.hello}</div>
		</PageWrapper>
	)
}

export default Home
