import { Button, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import PrimaryIcon from 'public/images/icons-badge.svg'
import Image from 'next/image'
import { useSetAtom } from 'jotai'
import { mintUSDi } from '~/features/globalAtom'
import { ON_USD } from '~/utils/constants'

const GetOnUSD: React.FC = () => {
  const setMintUsdi = useSetAtom(mintUSDi)
  return (
    <Wrapper>
      <Box display='flex' gap={1} alignItems='center'>
        <Image src={PrimaryIcon} width={19} alt='primary' />
        <Box><Typography variant='p_lg' color='#fff'>Need {ON_USD}?</Typography></Box>
      </Box>
      <Box lineHeight={1} my='10px'><Typography variant='p' color='#a7a7a7'>Devnet USD is needed for you to trade on Clone Markets for Eclipse Testnet.</Typography></Box>
      <GetButton onClick={() => setMintUsdi(true)}><Typography variant='p'>Get Devnet USD</Typography></GetButton>
    </Wrapper>
  )
}

export default GetOnUSD

const Wrapper = styled(Box)`
  width: 100%;
  height: 145px;
  text-align: left;
  padding: 12px 16px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.05);
`

const GetButton = styled(Button)`
  width: 125px;
  height: 39px;
  flex-grow: 0;
  padding: 8px 4px 8px 5px;
  border-radius: 100px;
  color: #000;
  background-color: ${(props) => props.theme.basis.melrose};
  margin-top: 5px;
  
  &:hover {
		background-color: ${(props) => props.theme.basis.lightSlateBlue};
	}
`
