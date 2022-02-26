import * as React from 'react'
import type { NextPage } from 'next'
import { styled } from '@mui/system'
import Head from 'next/head'
import Container from '@mui/material/Container'
import BalanceView from '~/containers/Home/BalanceView'
import BalanceList from '~/containers/Portfolio/BalanceList'

const IportfolioPage: NextPage = () => {
	return (
		<div>
			<Head>
				<title>iPortfolio - Incept Protocol</title>
			</Head>
			<main>
        <StyledSection sx={{
          backgroundColor: '#FAFAFA',
        }}>
          <Container>
            <BalanceView />
            <BalanceList />
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
