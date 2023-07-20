'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { styled } from '@mui/system'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import { Box, Stack } from '@mui/material'
import { AssetTickers } from '~/data/assets'

const AssetPage = ({ params }: { params: { assetTicker: string } }) => {
  const router = useRouter()
  const [assetId, setAssetId] = useState(0)
  const assetTicker = params.assetTicker || AssetTickers.euro

  useMemo(() => {
    if (assetTicker) {
      console.log('assetId', AssetTickers[assetTicker as keyof typeof AssetTickers])

      if (AssetTickers[assetTicker as keyof typeof AssetTickers]) {
        setAssetId(AssetTickers[assetTicker as keyof typeof AssetTickers])
      } else {
        setAssetId(AssetTickers.euro)
        router.replace('/trade/euro')
      }
    }
  }, [assetTicker])

  const handleSelectAssetId = useCallback((id: number) => {
    setAssetId(id)
  }, [assetId])

  return (
    <div>
      <Head>
        <title>Clone Markets - The Most Efficient Trading on Solana</title>
        <meta name="description" content="Clone Markets allows users to trade onAssets, our synthetic derivatives that bring supercharged liquidity and rapid scalability to trading on Solana." />
        <link rel="icon" href="/favicon.png" />
        <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet' />
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
