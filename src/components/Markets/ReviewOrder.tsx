import { Box, Stack, Button, styled, Divider } from '@mui/material'

interface Props {
  onConfirm: () => void
}

const ReviewOrder: React.FC<Props> = ({ onConfirm }) => {
  
  return (
    <Box sx={{
      p: '20px'
    }}>
      <StyledStack direction="row" justifyContent="space-between">
        <div>{'<'}</div>
        <div>Sell iSOL</div>
        <div></div>
      </StyledStack>

      <Box>
        <Subtitle>Order Summary</Subtitle>
        <Stack sx={{marginBottom: '13px'}} spacing={1} direction="row" justifyContent="space-between">
          <div>Amount</div>
          <Stack spacing={1} alignItems="flex-end">
            <div>1.00 SOL</div>
            <div>$102.95 USDi</div>
          </Stack>
        </Stack>
        <Stack sx={{marginBottom: '26px', marginTop: '13px'}} spacing={1} direction="row" justifyContent="space-between">
          <div>Trading Fee</div>
          <Stack spacing={1} alignItems="flex-end">
            <div>0.03%</div>
            <div>$0.308 USDi</div>
          </Stack>
        </Stack>
        <Divider />
        <TotalStack spacing={1} direction="row" justifyContent="space-between">
          <div>Total</div>
          <div>$103.26 USDi</div>
        </TotalStack>
      </Box>

      <ActionButton onClick={onConfirm}>Confirm</ActionButton>      
    </Box>
  )
}

const StyledStack = styled(Stack)`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 30px;
`

const Subtitle = styled(Box)`
  text-align: left;
  margin-bottom: 26px;
  font-size: 14px;
  font-weight: 600;
`

const TotalStack = styled(Stack)`
  font-size: 14px;
  font-weight: 600;
  margin-top: 29px;
  margin-bottom: 29px;
`

const ActionButton = styled(Button)`
  width: 100%;
  background: #3461ff;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 15px;
`

export default ReviewOrder
