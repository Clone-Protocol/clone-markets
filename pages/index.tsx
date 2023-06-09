import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { styled, Box } from '@mui/system'
import Container from '@mui/material/Container'
import MarketList from '~/containers/Markets/MarketList'
import GetUSDiBadge from '~/components/Markets/GetUSDiBadge'
import PortfolioBalance from '~/components/Markets/PortfolioBalance'
import { useWallet } from '@solana/wallet-adapter-react'

const Home: NextPage = () => {
	const { publicKey } = useWallet()
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
						<PortfolioBalance />
						{publicKey &&
							<Box>
								<Divider />
								<Box mb='30px'>
									<GetUSDiBadge />
								</Box>
							</Box>
						}
						<MarketList />
					</Container>
				</StyledSection>
			</main>
		</div>
	)
}

const StyledSection = styled('section')`
	max-width: 1085px;
	margin: 0 auto;
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 100px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 50px 0px;
	}
`

const Divider = styled('div')`
	width: 100%;
	height: 1px;
	margin-top: 30px;
	margin-bottom: 30px;
	background-color: rgba(155, 121, 252, 0.5);
`

export default Home
