import type { NextPage } from 'next'
import { styled } from '@mui/system'
import Head from 'next/head'
import { Container } from '@mui/material'
import PortfolioView from '~/containers/Portfolio/PortfolioView'

const IportfolioPage: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Portfolio - Clone Protocol</title>
				<meta name="description" content="Portfolio - Clone Markets" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<StyledSection>
					<Container>
						<PortfolioView />
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

export default IportfolioPage
