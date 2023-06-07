import React from 'react';
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfoTooltip from '~/components/Common/InfoTooltip'

interface Props {
  iassetPrice: number
  iassetAmount: number
  tickerSymbol: string
  priceImpact: number
  slippage: number
  tradeFee: number
}

const OrderDetails: React.FC<Props> = ({ iassetPrice, iassetAmount, tickerSymbol, priceImpact, slippage, tradeFee }) => {
  const minReceived = (1 - (slippage / 100)) * iassetAmount
  const iassetTradeFee = (tradeFee / 100) * iassetAmount
  const iassetTradeFeeDollar = (tradeFee / 100) * iassetPrice * iassetAmount

  return (
    <Wrapper>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Price Impact <InfoTooltip title="Price Impact" color='#8988a3' /></Typography>
        <PriceImpactValue>&lt; {isNaN(priceImpact) ? '0' : priceImpact}%</PriceImpactValue>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Minimum received <InfoTooltip title="Minimum received" color='#8988a3' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Box><Typography variant='p' fontWeight={600} color='#c4b5fd'>{isNaN(minReceived) ? '0' : minReceived?.toLocaleString()} {tickerSymbol}</Typography></Box>
          <Box><Typography variant='p_sm'>Slippage tolerance: {slippage?.toFixed(1)}%</Typography></Box>
        </div>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Trade Fees <InfoTooltip title="Trade fees" color='#8988a3' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Typography variant='p' fontWeight={600} color='#c4b5fd'>{isNaN(iassetTradeFee) ? '0' : iassetTradeFee?.toFixed(6)} {tickerSymbol}</Typography>
          <Box><Typography variant='p_sm'>{tradeFee}% (${iassetTradeFeeDollar?.toFixed(2)})</Typography></Box>
        </div>
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 100%;
  margin: 13px 0 16px;
  padding: 5px 12px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
`

const DetailValue = styled('div')`
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  text-align: right;
`

const DetailComment = styled('div')`
  color: #898989;
  font-size: 10px; 
  font-weight: 500;
  text-align: right;
`

const PriceImpactValue = styled('div')`
  color: ${(props) => props.theme.basis.lightGreen};
  font-size: 12px; 
  font-weight: 600;
`

export default OrderDetails