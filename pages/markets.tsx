import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

const MarketsPage: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Markets</title>
			</Head>
			<main>
				<Container>
					<Typography variant="h1">Markets Page</Typography>
				</Container>
			</main>
		</div>
	)
}

export default MarketsPage
