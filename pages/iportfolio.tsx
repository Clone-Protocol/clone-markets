import { useRef } from 'react'
import type { NextPage } from 'next'
import { styled } from '@mui/system'
import Head from 'next/head'
import { Container, Box } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import BalanceView from '~/containers/Home/BalanceView'
import BalanceList from '~/containers/Portfolio/BalanceList'
import BackdropMsg from '~/components/Portfolio/BackdropMsg'

const IportfolioPage: NextPage = () => {
  const { publicKey } = useWallet()

	return (
		<div>
			<Head>
				<title>iPortfolio - Incept Protocol</title>
			</Head>
			<main>
				<StyledSection>
					<Container>
						<BalanceView />
						<Box sx={{ marginTop: '58px' }}>
							<BalanceList />
						</Box>
            { !publicKey && <BackdropMsg /> }
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
