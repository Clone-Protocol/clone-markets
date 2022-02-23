import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { styled } from '@mui/system'
import Container from '@mui/material/Container'
import MarketList from '~/containers/Markets/MarketList'

const MarketsPage: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Markets</title>
			</Head>
			<main>
        <StyledSection sx={{
          backgroundColor: '#FAFAFA',
        }}>
          <Container>
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

export default MarketsPage
