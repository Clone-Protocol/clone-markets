import React from 'react';
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfoTooltip from '~/components/Common/InfoTooltip'

interface Props {
  isBuy: boolean,
  onusdAmount: number,
  onassetPrice: number
  onassetAmount: number
  tickerSymbol: string
  priceImpact: number
  slippage: number
  tradeFee: number
  estimatedFees: number
}

const OrderDetails: React.FC<Props> = ({ isBuy, onusdAmount, onassetPrice, onassetAmount, tickerSymbol, priceImpact, slippage, tradeFee, estimatedFees }) => {
  const slippageMultiplier = (1 - (slippage / 100))
  const [minReceived, outputSymbol, tradeFeeDollar] = (() => {
    if (isBuy) {
      return [slippageMultiplier * onassetAmount, tickerSymbol, estimatedFees * onassetPrice]
    } else {
      return [slippageMultiplier * onusdAmount, "onUSD", estimatedFees]
    }
  })()

  return (
    <Wrapper>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Price Impact <InfoTooltip title="Price Impact" color='#8988a3' /></Typography>
        <PriceImpactValue>&lt; {isNaN(priceImpact) ? '0' : priceImpact}%</PriceImpactValue>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Minimum received <InfoTooltip title="Minimum received" color='#8988a3' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Box><Typography variant='p' fontWeight={600} color='#c4b5fd'>{isNaN(minReceived) ? '0' : minReceived?.toLocaleString()} {outputSymbol}</Typography></Box>
          <Box><Typography variant='p_sm'>Slippage tolerance: {slippage?.toFixed(1)}%</Typography></Box>
        </div>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Trade Fees <InfoTooltip title="Trade fees" color='#8988a3' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Typography variant='p' fontWeight={600} color='#c4b5fd'>{isNaN(estimatedFees) ? '0' : estimatedFees?.toFixed(6)} {outputSymbol}</Typography>
          <Box><Typography variant='p_sm'>{tradeFee}% (${isNaN(tradeFeeDollar) ? '0' : tradeFeeDollar?.toFixed(6)})</Typography></Box>
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
const PriceImpactValue = styled('div')`
  color: ${(props) => props.theme.basis.lightGreen};
  font-size: 12px; 
  font-weight: 600;
`

export default OrderDetails