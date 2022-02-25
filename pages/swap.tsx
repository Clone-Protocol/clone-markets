import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import SwapApp from '~/containers/Swap'

const Swap: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Swap</title>
			</Head>
			<main>
				<Container>
					<Typography variant="h1">Swap Page</Typography>
          <SwapApp />
				</Container>
			</main>
		</div>
	)
}

export default Swap
