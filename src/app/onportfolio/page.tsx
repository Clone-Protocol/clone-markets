'use client'
import { styled } from '@mui/system'
import Head from 'next/head'
import { Container } from '@mui/material'
import PortfolioView from '~/containers/Portfolio/PortfolioView'

const IportfolioPage = () => {
  return (
    <div>
      <Head>
        <title>Clone Markets - The Most Efficient Trading on Solana</title>
        <meta name="description" content="Clone Markets allows users to trade onAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading on Solana." />
        <link rel="icon" href="/favicon.png" />
        <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet' />
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
