import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { styled } from '@mui/system'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import { Box, Stack } from '@mui/material'

const AssetPage: NextPage = () => {
	const router = useRouter()
	const [assetId, setAssetId] = useState(router.query.assetId || 0)

	const handleSelectAssetId = (id: number) => {
		setAssetId(id)
	}

	return (
		<div>
			<Head>
				<title>Asset - Incept Markets</title>
				<meta name="description" content="Asset - Incept Markets" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<StyledSection
					sx={{
						backgroundColor: '#000',
					}}>
					<Stack direction='row' gap={1} justifyContent="center">
						<Box minWidth='750px'>
							<MarketDetail assetId={assetId} />
						</Box>
						<Box width='360px'>
							<TradingBox assetId={assetId} onSelectAssetId={handleSelectAssetId} />
						</Box>
					</Stack>
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
