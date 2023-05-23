import { Button, styled, Box, Typography } from '@mui/material'
import PrimaryIcon from 'public/images/icons-badge.svg'
import Image from 'next/image'

const GetOnUSD: React.FC = () => {
  return (
    <Wrapper>
      <Box display='flex' gap={1} alignItems='center'>
        <Image src={PrimaryIcon} width='19px' />
        <Box><Typography variant='p_lg' color='#9b79fc'>Need onUSD?</Typography></Box>
      </Box>
      <Box lineHeight={1}><Typography variant='p' color='#8988a3'>Devnet onUSD is needed for you to trade on Devnet Clone Markets app.</Typography></Box>
      <GetButton><Typography variant='p'>Get Devnet onUSD</Typography></GetButton>
    </Wrapper>
  )
}

export default GetOnUSD

const Wrapper = styled(Box)`
  width: 100%;
  height: 145px;
  text-align: left;
  padding: 12px 24px;
  border-radius: 15px;
  background-color: rgba(155, 121, 252, 0.1)
`

const GetButton = styled(Button)`
  width: 125px;
  height: 39px;
  flex-grow: 0;
  padding: 8px 4px 8px 5px;
  border-radius: 100px;
  color: #fff;
  background-color: rgba(196, 181, 253, 0.1);
  margin-top: 14px;
`
