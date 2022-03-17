import type { NextPage } from 'next'
import Head from 'next/head'
import { styled } from '@mui/system'
import { Container, Box } from '@mui/material'
import WelcomeMsg from '~/components/Home/WelcomeMsg'
import BalanceView from '~/containers/Home/BalanceView'

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Incept Protocol</title>
				<meta name="description" content="Incept Protocol" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<StyledSection
					sx={{
						backgroundColor: '#FAFAFA',
					}}>
					<Container>
						<WelcomeMsg />
						<Box sx={{ marginTop: '40px' }}>
							<BalanceView />
						</Box>
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
