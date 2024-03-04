import { t } from '@lingui/macro'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { loadCatalog } from 'translations/utils'

export default function Page404() {
	return (
		<>
			<Head>
				<title>{t`Not Found`}</title>
			</Head>
			<div className='w-full h-[100vh] flex justify-center items-center'>
				<h1>{t`Not Found`}</h1>
			</div>
		</>
	)
}

export async function getStaticProps(
	ctx: GetStaticPropsContext
): Promise<GetStaticPropsResult<any>> {
	return {
		props: {
			i18n: await loadCatalog(ctx.locale as string),
		},
	}
}
