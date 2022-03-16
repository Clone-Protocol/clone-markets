import * as React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { styled } from '@mui/system'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import { Grid } from '@mui/material'

const AssetPage: NextPage = () => {
  const router = useRouter()
  const { assetId } = router.query

	return (
		<div>
			<Head>
				<title>Asset</title>
			</Head>
			<main>
				<StyledSection
					sx={{
						backgroundColor: '#FAFAFA',
					}}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={8}>
							<MarketDetail assetId={assetId} />
						</Grid>
						<Grid item xs={12} md={4}>
							<TradingBox assetId={assetId} />
						</Grid>
					</Grid>
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
