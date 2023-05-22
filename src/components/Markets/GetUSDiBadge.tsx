import { styled, Typography, Stack, Box, Button } from '@mui/material'
import Image from 'next/image'
import PrimaryIcon from 'public/images/icons-badge.svg'

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const GetUSDiBadge: React.FC<Props> = ({ onChange }) => {
  return <StyledStack direction='row' justifyContent='center' alignItems='center' spacing={2}>
    <Image src={PrimaryIcon} />
    <Box>
      <Typography variant='p_lg'>Get onUSD from the faucet to start trading on Devnet. On mainnet, you can acquire onUSD through 1:1 swap with USDC.</Typography>
    </Box>
    <GetButton><Typography variant='p'>Get Devnet onUSD</Typography></GetButton>
  </StyledStack>
}

const StyledStack = styled(Stack)`
  width: 100%;
  height: 74px;
  color: ${(props) => props.theme.basis.lightSlateBlue};
  border-radius: 10px;
  background-color: rgba(170, 63, 255, 0.12);
`

const GetButton = styled(Button)`
  width: 125px;
  height: 39px;
  flex-grow: 0;
  padding: 8px 4px 8px 5px;
  border-radius: 100px;
  color: #fff;
  background-color: rgba(196, 181, 253, 0.1);
`

export default GetUSDiBadge
