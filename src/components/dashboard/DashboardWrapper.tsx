import Head from 'next/head'
import React from 'react'

export default function DashboardWrapper(props: { children: React.ReactNode }) {
	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>

			{props.children}
		</>
	)
}
