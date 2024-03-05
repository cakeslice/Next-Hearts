import { t } from '@lingui/macro'
import { Button } from '@nextui-org/react'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { loadCatalog } from 'translations/utils'

export default function Page404() {
	return (
		<>
			<Head>
				<title>{t`Page not found!`}</title>
			</Head>
			<div className='w-full h-[100vh] text-center flex flex-col justify-center items-center gap-10'>
				<div>
					<h1>{`404`}</h1>
					<h3>{t`PAGE NOT FOUND`}</h3>
				</div>

				<p>{t`The page you were looking for doesn't exist`}</p>

				<Button as={Link} href='/'>
					{t`Back to Home`}
				</Button>
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
