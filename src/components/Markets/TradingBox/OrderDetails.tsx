import React from 'react';
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { ON_USD } from '~/utils/constants';

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
      return [slippageMultiplier * onusdAmount, ON_USD, estimatedFees]
    }
  })()

  return (
    <Wrapper>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#dadada' display='flex' alignItems='center'>Price Impact <InfoTooltip title="Price Impact" color='#dadada' /></Typography>
        <PriceImpactValue>{isNaN(priceImpact) || priceImpact < 0.1 ? '<' : '~'} {isNaN(priceImpact) ? '0.1' : Math.max(priceImpact, 0.1)}%</PriceImpactValue>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#dadada' display='flex' alignItems='center'>Minimum received <InfoTooltip title="Minimum received" color='#dadada' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Box><Typography variant='p' fontWeight={600} color='#fff'>{isNaN(minReceived) ? '0' : minReceived?.toLocaleString()} {outputSymbol}</Typography></Box>
          <Box><Typography variant='p_sm' color='#a7a7a7'>Slippage tolerance: {slippage?.toLocaleString()}%</Typography></Box>
        </div>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#dadada' display='flex' alignItems='center'>Trade Fees <InfoTooltip title="Trade fees" color='#dadada' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Typography variant='p' fontWeight={600} color='#fff'>{isNaN(estimatedFees) ? '0' : estimatedFees?.toFixed(6)} {outputSymbol}</Typography>
          <Box><Typography variant='p_sm' color='#a7a7a7'>{tradeFee.toFixed(2)}% (${isNaN(tradeFeeDollar) ? '0' : tradeFeeDollar?.toFixed(6)})</Typography></Box>
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