import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { styled } from '@mui/system'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import { Grid } from '@mui/material'

const AssetPage: NextPage = () => {
	const router = useRouter()
	const [assetId, setAssetId] = useState(router.query.assetId || 0)

	const handleSelectAssetId = (id: number) => {
		setAssetId(id)
	}

	return (
		<div>
			<Head>
				<title>Asset</title>
				<meta name="description" content="Asset - Incept Markets" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<StyledSection
					sx={{
						backgroundColor: '#000',
					}}>
					<Grid container spacing={1} justifyContent="center">
						<Grid item xs={12} md={7} sx={{ padding: '30px' }}>
							<MarketDetail assetId={assetId} />
						</Grid>
						<Grid item xs={12} md={4} sx={{ padding: '30px' }}>
							<TradingBox assetId={assetId} onSelectAssetId={handleSelectAssetId} />
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
