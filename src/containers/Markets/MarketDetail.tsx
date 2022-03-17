import { useEffect, useState } from 'react'
import { Box, Stack, Button, styled } from '@mui/material'
import Chart from '~/components/Markets/MarketDetail/Chart'
import Image from 'next/image'
import { useIncept } from '~/hooks/useIncept'
import { useWallet } from '@solana/wallet-adapter-react'
import { Asset, fetchAsset, fetchAssetDefault } from '~/web3/Markets/detail'

const MarketDetail = ({ assetId }: { assetId: string }) => {
  const { publicKey } = useWallet()
  const { getInceptApp } = useIncept()
  const [asset, setAsset] = useState<Asset>(fetchAssetDefault())
  const [assetIndex, _] = useState(parseInt(assetId) - 1)

  useEffect(() => {
    const program = getInceptApp()

    async function fetch() {
      const data = await fetchAsset({
        program,
        userPubKey: publicKey!,
        index: assetIndex
      })
      if (data) {
        setAsset({
          ...asset,
          tickerIcon: data.tickerIcon,
          tickerSymbol: data.tickerSymbol,
          tickerName: data.tickerName,
          detailOverview: data.tickerName,
          price: data.price,
          myHolding: data.balance,
          myPortfolioPercentage: data.portfolioPercentage,
          avgLiquidity: data.liquidity,
          myNotionalVal: data.balance * data.price
        })
      }
    }
    fetch()
  }, [publicKey, assetId])

  return (
    <>
      {asset ?
        <Stack mb={2} direction="column" padding={5}>
          <Box display='flex'>
            <Image src={asset.tickerIcon} width="40px" height="40px" />
            <Box sx={{ fontSize: '28px', fontWeight: '600', marginRight: '15px', marginLeft: '10px' }}>{asset.tickerName}</Box>
            <Box sx={{ color: '#757a7f', fontSize: '24px', fontWeight: '600', lineHeight: '42px' }}>{asset.tickerSymbol}</Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: '40px', fontWeight: 'normal' }}>${asset.price}</Box>
          </Box>

          <Box>
          <Chart />
          <></>
          </Box>

          <Box sx={{ marginBottom: '40px' }}>
            <SubTitle>Market Overview</SubTitle>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <ContentHeader>Volume (24h)</ContentHeader>
                <ContentValue>${asset.volume.toLocaleString()} USDi</ContentValue>
              </Box>
              <Box>
                <ContentHeader>Avg Liquidity (24h)</ContentHeader>
                <ContentValue>${asset.avgLiquidity.toLocaleString()} USDi</ContentValue>
              </Box>
              <Box>
                <ContentHeader>Maximum Order Size</ContentHeader>
                <ContentValue>{asset.maxOrderSize} {asset.tickerSymbol}</ContentValue>
              </Box>
              <Box>
                <ContentHeader>Avg Premium (24h)</ContentHeader>
                <ContentValue>{asset.avgPremium}%</ContentValue>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ marginBottom: '40px' }}>
            <SubTitle>About {asset.tickerSymbol}</SubTitle>
            <Box sx={{ fontSize: '14px', fontWeight: '300' }}>
              {asset.detailOverview}
            </Box>
            <Box sx={{ fontSize: '14px', fontWeight: '600', textDecoration: 'underline'}}>
              Tell me more
            </Box>
          </Box>

          <Box>
            <SubTitle>My {asset.tickerSymbol}</SubTitle>
            <Stack direction="row" justifyContent="space-evenly">
              <Box>
                <ContentHeader>Holding</ContentHeader>
                <ContentValue>{asset.myHolding} {asset.tickerSymbol}</ContentValue>
              </Box>
              <Box>
                <ContentHeader>Notional Value</ContentHeader>
                <ContentValue>${asset.myNotionalVal} USDi</ContentValue>
              </Box>
              <Box>
                <ContentHeader>iPortfolio Percentage</ContentHeader>
                <ContentValue>{asset.myPortfolioPercentage}%</ContentValue>
              </Box>
            </Stack>
          </Box>
        </Stack>
      : <></>}
    </>
  )
}

const SubTitle = styled('div')`
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 20px;
`

const ContentHeader = styled('div')`
  font-size: 12px;
  font-weight: 600;
  color: #5f5f5f;
`

const ContentValue = styled('div')`
  font-size: 23px;
`


export default MarketDetail