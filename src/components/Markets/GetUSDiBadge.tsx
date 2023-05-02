import { styled, Typography, Stack, Box, Button } from '@mui/material'
import Image from 'next/image'
import SearchIcon from 'public/images/search-icon.svg'

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const GetUSDiBadge: React.FC<Props> = ({ onChange }) => {
  return <StyledStack direction='row' justifyContent='center' alignItems='center' spacing={2}>
    <Image src={SearchIcon} />
    <Box>
      <Typography variant='p_lg'>Get USDi from the faucet to start trading on Devnet. On mainnet, you can easily acquire USDi through 1:1 swap with USDC.</Typography>
    </Box>
    <GetButton><Typography variant='p'>Get Devnet USDi</Typography></GetButton>
  </StyledStack>
}

const StyledStack = styled(Stack)`
  width: 1085px;
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
