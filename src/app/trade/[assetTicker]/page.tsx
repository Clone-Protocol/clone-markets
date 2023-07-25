'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
