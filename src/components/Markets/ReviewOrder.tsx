import { Box, Stack, Button, styled, Divider } from '@mui/material'

interface Props {
  title: string | null,
  ticker: string | null,
  value?: number,
  onChange?: () => void
}

const ReviewOrder: React.FC<Props> = ({  }) => {
  
  return (
    <Box>
      <Box sx={{
        display: 'flex',
        p: 2,
      }}>
        <div></div>
        <div>Sell iSOL</div>
      </Box>

      <Box>
        <div>Order Summary</div>
        <Box>
          <div>Amount</div>
          <Stack spacing={1}>
            <div>1.00 SOL</div>
            <div>$102.95 USDi</div>
          </Stack>
        </Box>
        <Box>
          <div>Trading Fee</div>
          <Stack spacing={1}>
            <div>0.03%</div>
            <div>$0.308 USDi</div>
          </Stack>
        </Box>
        <Divider />
        <Box>
          <div>Total</div>
          <div>$103.26 USDi</div>
        </Box>
      </Box>

      <ActionButton>Confirm</ActionButton>      
    </Box>
  )
}

const ActionButton = styled(Button)`
  background: #3461ff;
  color: #fff;
`

export default ReviewOrder
