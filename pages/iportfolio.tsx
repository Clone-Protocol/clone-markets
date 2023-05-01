import type { NextPage } from 'next'
import { styled } from '@mui/system'
import Head from 'next/head'
import { Container } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import PortfolioView from '~/containers/Portfolio/PortfolioView'
import BackdropMsg from '~/components/Portfolio/BackdropMsg'

const IportfolioPage: NextPage = () => {
	const { publicKey } = useWallet()

	return (
		<div>
			<Head>
				<title>iPortfolio - Incept Protocol</title>
				<meta name="description" content="iPortfolio - Incept Markets" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<StyledSection>
					<Container>
						<PortfolioView />

						{!publicKey && <BackdropMsg />}
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

export default IportfolioPage
