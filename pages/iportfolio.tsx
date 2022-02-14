import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

const IportfolioPage: NextPage = () => {
	return (
		<div>
			<Head>
				<title>iPortfolio</title>
			</Head>
			<main>
				<Container>
					<Typography variant="h1">iPortfolio Page</Typography>
				</Container>
			</main>
		</div>
	)
}

export default IportfolioPage
