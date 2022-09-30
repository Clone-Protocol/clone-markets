import { Box, Stack } from '@mui/material'
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

  const minReceived = (1-(slippage/100)) * iassetAmount
  const iassetTradeFee = (tradeFee / 100) * iassetAmount
  const iassetTradeFeeDollar = (tradeFee / 100) * iassetPrice * iassetAmount

  return (
    <Wrapper>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DetailHeader>Rate</DetailHeader>
        <DetailValue>{iassetPrice?.toLocaleString()} USDi / {tickerSymbol}</DetailValue>
      </Stack>
      <Stack sx={{ marginTop: '8px' }} direction="row" justifyContent="space-between" alignItems="center">
        <DetailHeader>Price Impact <InfoTooltip title="Price Impact" /></DetailHeader>
        <div style={{ color: '#0f6', fontSize: '11px', fontWeight: '600' }}>&lt; {priceImpact}%</div>
      </Stack>
      <Stack sx={{ marginTop: '8px' }} direction="row" justifyContent="space-between" alignItems="center">
        <DetailHeader>Minimum received <InfoTooltip title="Minimum received" /></DetailHeader>
        <div style={{ lineHeight: '12px' }}>
          <DetailValue>{minReceived?.toLocaleString()} {tickerSymbol}</DetailValue>
          <div style={{ color: '#898989', fontSize: '10px', fontWeight: '500', textAlign: 'right' }}>Slippage tolerance: {slippage?.toFixed(1)}%</div>
        </div>
      </Stack>
      <Stack sx={{ marginTop: '9px' }} direction="row" justifyContent="space-between" alignItems="center">
        <DetailHeader>Trade fees <InfoTooltip title="Trade fees" /></DetailHeader>
        <div style={{ lineHeight: '12px' }}>
          <DetailValue>{iassetTradeFee?.toFixed(6)} {tickerSymbol}</DetailValue>
          <div style={{ color: '#898989', fontSize: '10px', fontWeight: '500', textAlign: 'right' }}>{tradeFee}% (${iassetTradeFeeDollar?.toFixed(2)})</div>
        </div>
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 100%;
  height: 153px;
  margin: 13px 0 16px;
  padding: 14px 23px 13px 15px;
  border-radius: 10px;
  border: solid 1px #444;
`

const DetailHeader = styled('div')`
	font-size: 10px;
	font-weight: 500;
	color: #868686;
`

const DetailValue = styled('div')`
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  text-align: right;
`

export default OrderDetails