import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { styled } from '@mui/system'
import Container from '@mui/material/Container'
import MarketList from '~/containers/Markets/MarketList'
import GetUSDiBadge from '~/components/Markets/GetUSDiBadge'

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Incept Markets - Beta</title>
				<meta name="description" content="Incept Markets - Beta" />
				<link rel="icon" href="/favicon.ico" />
				<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet' />
			</Head>

			<main>
				<StyledSection>
					<Container>
						<GetUSDiBadge />
						<MarketList />
					</Container>
				</StyledSection>
			</main>
		</div>
	)
}

const StyledSection = styled('section')`
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 100px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 50px 0px;
	}
`

export default Home
