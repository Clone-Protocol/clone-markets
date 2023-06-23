import { Button, Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PrimaryIcon from 'public/images/icons-badge.svg'
import Image from 'next/image'
import { useSetRecoilState } from 'recoil'
import { mintUSDi } from '~/features/globalAtom'

const GetOnUSD: React.FC = () => {
  const setMintUsdi = useSetRecoilState(mintUSDi)
  return (
    <Wrapper>
      <Box display='flex' gap={1} alignItems='center'>
        <Image src={PrimaryIcon} width='19px' />
        <Box><Typography variant='p_lg' color='#9b79fc'>Need onUSD?</Typography></Box>
      </Box>
      <Box lineHeight={1}><Typography variant='p' color='#8988a3'>Devnet onUSD is needed for you to trade on Devnet Clone Markets app.</Typography></Box>
      <GetButton onClick={() => setMintUsdi(true)}><Typography variant='p'>Get Devnet onUSD</Typography></GetButton>
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
  
  &:hover {
		background-color: rgba(155, 121, 252, 0.15);

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 100px;
			border: 1px solid transparent;
			background: ${(props) => props.theme.gradients.light} border-box;
			-webkit-mask:
				linear-gradient(#fff 0 0) padding-box, 
				linear-gradient(#fff 0 0);
			-webkit-mask-composite: destination-out;
			mask-composite: exclude;
		}
	}
`
