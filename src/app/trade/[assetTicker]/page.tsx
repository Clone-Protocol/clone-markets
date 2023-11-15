'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import { AssetTickers } from '~/data/assets'

const AssetPage = ({ params }: { params: { assetTicker: string } }) => {
  const router = useRouter()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [assetId, setAssetId] = useState(0)
  const assetTicker = params.assetTicker || AssetTickers.euro
  const [showTrading, setShowTrading] = useState(false)

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

  const toggleShowTrading = () => {
    setShowTrading(!showTrading)
  }

  return (
    <div>
      <StyledSection
        sx={{
          backgroundColor: '#000',
        }}>
        <Stack direction={isMobileOnSize ? 'column' : 'row'} gap={1} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
          <Box minWidth={isMobileOnSize ? '360px' : '750px'}>
            <MarketDetail assetId={assetId} />
          </Box>
          <Box width={showTrading ? '100%' : '360px'} height='100%' overflow={showTrading ? 'auto' : 'hidden'} display={showTrading ? 'flex' : 'block'} justifyContent={showTrading ? 'center' : ''} position={showTrading ? 'fixed' : 'relative'} bgcolor={showTrading ? '#000' : 'transparent'} top={showTrading ? '45px' : 'inherit'}>
            {(showTrading || !isMobileOnSize) && <TradingBox assetId={assetId} onSelectAssetId={handleSelectAssetId} />}
          </Box>
        </Stack>
      </StyledSection>
      <Box display={isMobileOnSize ? 'block' : 'none'}><ShowTradingBtn onClick={() => toggleShowTrading()}>{showTrading ? 'Hide Swap' : 'Swap'}</ShowTradingBtn></Box>
    </div>
  )
}

const StyledSection = styled('section')`
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 100px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 70px 0px 110px 0px;
	}
`
const ShowTradingBtn = styled(Box)`
  position: fixed;
  bottom: 48px;
  width: 95%;
  height: 36px;
  color: #fff;
	border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  cursor: pointer;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
	&:hover {
		background: ${(props) => props.theme.basis.royalPurple};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`

export default AssetPage
