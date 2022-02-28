import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { styled } from '@mui/system'
import Container from '@mui/material/Container'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'

const AssetPage: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Asset</title>
			</Head>
			<main>
        <StyledSection sx={{
          backgroundColor: '#FAFAFA',
        }}>
          <Container>
            <MarketDetail />
            <TradingBox />
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

export default AssetPage
