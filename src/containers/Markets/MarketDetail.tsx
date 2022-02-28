import { Box, Stack, Button, Image, styled } from '@mui/material'
import Chart from '~/components/Markets/MarketDetail/Chart'

const MarketDetail = () => {

  return (
    <>
      <Stack mb={2} direction="column">
        <Box display='flex'>
          {/* <Image src={} width="40px" height="40px" /> */}
          <Box sx={{ fontSize: '28px', fontWeight: '600', marginRight: '15px' }}>iSolana</Box>
          <Box sx={{ color: '#757a7f', fontSize: '24px', fontWeight: '600' }}>iSOL</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: '45px' }}>$160.51</Box>
        </Box>

        <Box>
         <Chart />
        </Box>

        <Box sx={{ marginBottom: '88px' }}>
          <SubTitle>Market Overview</SubTitle>
          <Stack direction="row" justifyContent="space-evenly">
            <Box>
              <ContentHeader>Volume (24h)</ContentHeader>
              <ContentValue>$12.3M USDi</ContentValue>
            </Box>
            <Box>
              <ContentHeader>Avg Liquidity (24h)</ContentHeader>
              <ContentValue>$50.7M USDi</ContentValue>
            </Box>
            <Box>
              <ContentHeader>Maximum Order Size</ContentHeader>
              <ContentValue>150 iSOL</ContentValue>
            </Box>
            <Box>
              <ContentHeader>Avg Premium (24h)</ContentHeader>
              <ContentValue>0.013%</ContentValue>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ marginBottom: '60px' }}>
          <SubTitle>About iSOL</SubTitle>
          <Box sx={{ fontSize: '14px', fontWeight: '300' }}>
            iSOL, appreviated from iSolana, is a synthetic asset of Solana on Incept. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.
          </Box>
          <Box sx={{ fontSize: '14px', fontWeight: '600', textDecoration: 'underline'}}>
            Tell me more
          </Box>
        </Box>

        <Box>
          <SubTitle>My iSOL</SubTitle>
          <Stack direction="row" justifyContent="space-evenly">
            <Box>
              <ContentHeader>Holding</ContentHeader>
              <ContentValue>5.234 iSOL</ContentValue>
            </Box>
            <Box>
              <ContentHeader>Notional Value</ContentHeader>
              <ContentValue>$840.11 USDi</ContentValue>
            </Box>
            <Box>
              <ContentHeader>iPortfolio Percentage</ContentHeader>
              <ContentValue>31.64%</ContentValue>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}

const SubTitle = styled('div')`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 23px;
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