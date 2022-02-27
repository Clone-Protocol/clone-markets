import * as React from 'react'
import type { NextPage } from 'next'
import { styled } from '@mui/system'
import Head from 'next/head'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import SwapBox from '~/containers/Swap/SwapBox'

const Swap: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Swap</title>
			</Head>
			<main>
        <StyledSection sx={{
          backgroundColor: '#FAFAFA',
        }}>
          <Container>
            <SwapBox />
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

export default Swap
