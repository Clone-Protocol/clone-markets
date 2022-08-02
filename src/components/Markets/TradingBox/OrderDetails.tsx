import { Box, Stack, Button, Divider } from '@mui/material'
import { styled } from '@mui/system'

interface Props {
	rate?: number
	priceImpact?: number
	minReceived?: number
  tradeFees?: number
}

const OrderDetails: React.FC<Props> = () => {

  return (
    <Wrapper>
      <Stack direction="row" justifyContent="space-between">
        <DetailHeader>Rate</DetailHeader>
        <DetailValue>160.52 USDi / iSOL</DetailValue>
      </Stack>
      <Stack sx={{ marginTop: '12px' }} direction="row" justifyContent="space-between">
        <DetailHeader>Price Impact</DetailHeader>
        <div style={{ color: '#0f6', fontSize: '11px', fontWeight: '600' }}>&lt;0.1%</div>
      </Stack>
      <Stack sx={{ marginTop: '11px' }} direction="row" justifyContent="space-between">
        <DetailHeader>Minimum received</DetailHeader>
        <div style={{ lineHeight: '12px' }}>
          <DetailValue>10.445 iSOL</DetailValue>
          <div style={{ color: '#898989', fontSize: '10px', fontWeight: '500', textAlign: 'right' }}>Slippage tolerance: 1.0%</div>
        </div>
      </Stack>
      <Stack sx={{ marginTop: '12px' }} direction="row" justifyContent="space-between">
        <DetailHeader>Trade fees</DetailHeader>
        <div style={{ lineHeight: '12px' }}>
          <DetailValue>0.035656 iSOL</DetailValue>
          <div style={{ color: '#898989', fontSize: '10px', fontWeight: '500', textAlign: 'right' }}>0.15% ($1.56)</div>
        </div>
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 325px;
  height: 143px;
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